import "server-only"
import { randomUUID } from "node:crypto"
import { db, invoice, invoiceLineItem, order } from "@jp/db"
import { and, asc, eq, isNull, notExists, or, sql } from "drizzle-orm"
import { renderToBuffer } from "@react-pdf/renderer"
import { IssuedInvoice } from "@jp/pdf"
import { put } from "@vercel/blob"
import { createInvoiceSnapshot } from "./invoice.snapshot"

const BATCH_SIZE = 25
const RUN_BUDGET_MS = 240_000

async function snapshotOrder(id: number) {
  const source = await db.query.order.findFirst({
    where: and(eq(order.id, id), eq(order.status, "completed")),
    with: {
      organization: true,
      team: true,
      lineItems: { orderBy: (item, { asc }) => asc(item.id) },
    },
  })
  if (!source) return
  const { header, lines } = createInvoiceSnapshot(source)
  const insert = db
    .insert(invoice)
    .values(header)
    .onConflictDoNothing({ target: invoice.orderId })
    .returning({ id: invoice.id, orderId: invoice.orderId })

  // One statement commits the invoice, its lines and the order marker together.
  // Only the invocation that wins the unique orderId insert can copy lines.
  await db.execute(sql`
    WITH created AS (${insert.getSQL()}), copied AS (
      INSERT INTO invoice_line_item
        (invoice_id, order_line_item_id, product_id, item_code, title,
         unit_name, unit_quantity, quantity, catch_weight, uom, price,
         subtotal, is_taxable, tax_rate, tax_amount, total, sort_order)
      SELECT created.id, x."orderLineItemId", x."productId", x."itemCode", x.title,
        x."unitName", x."unitQuantity", x.quantity, x."catchWeight", x.uom, x.price,
        x.subtotal, x."isTaxable", x."taxRate", x."taxAmount", x.total, x."sortOrder"
      FROM created CROSS JOIN jsonb_to_recordset(${JSON.stringify(lines)}::jsonb) AS x(
        "orderLineItemId" integer, "productId" integer, "itemCode" text, title text,
        "unitName" text, "unitQuantity" numeric, quantity numeric, "catchWeight" boolean,
        uom text, price numeric, subtotal numeric, "isTaxable" boolean,
        "taxRate" numeric, "taxAmount" numeric, total numeric, "sortOrder" integer
      )
    )
    UPDATE "order" SET invoice_status = 'processing', updated_at = now()
    WHERE id IN (SELECT order_id FROM created)
  `)
}

async function claimInvoice() {
  const token = randomUUID()
  // A lease outlives the route's 300-second maxDuration. Crashed jobs become
  // eligible again; SKIP LOCKED lets overlapping cron runs process other work.
  const result = await db.execute<{ id: number }>(sql`
    WITH next AS (
      SELECT id FROM invoice
      WHERE status = 'processing' AND pdf_next_attempt_at <= now()
      ORDER BY pdf_next_attempt_at, id
      LIMIT 1 FOR UPDATE SKIP LOCKED
    )
    UPDATE invoice SET pdf_lease_token = ${token},
      pdf_next_attempt_at = now() + interval '10 minutes',
      pdf_attempts = pdf_attempts + 1, updated_at = now()
    FROM next WHERE invoice.id = next.id RETURNING invoice.id
  `)
  const claimed = result.rows[0]
  return claimed ? { id: claimed.id, token } : null
}

async function renderInvoice(id: number, token: string) {
  const [[saved], lines] = await Promise.all([
    db
      .select()
      .from(invoice)
      .where(and(eq(invoice.id, id), eq(invoice.pdfLeaseToken, token))),
    db
      .select()
      .from(invoiceLineItem)
      .where(eq(invoiceLineItem.invoiceId, id))
      .orderBy(asc(invoiceLineItem.sortOrder)),
  ])
  if (!saved) return false
  const buffer = await renderToBuffer(
    IssuedInvoice({ data: { ...saved, lineItems: lines } })
  )
  const blob = await put(`invoices/${saved.organizationId}/${id}.pdf`, buffer, {
    access: "private",
    token: process.env.INVOICE_BLOB_READ_WRITE_TOKEN,
    contentType: "application/pdf",
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  const result = await db.execute<{ id: number }>(sql`
    WITH issued AS (
      UPDATE invoice SET status = 'issued', pdf_pathname = ${blob.pathname},
        pdf_lease_token = NULL, pdf_error = NULL, updated_at = now()
      WHERE id = ${id} AND pdf_lease_token = ${token} AND status = 'processing'
      RETURNING order_id
    )
    UPDATE "order" SET invoice_status = 'issued', updated_at = now()
    WHERE id IN (SELECT order_id FROM issued) RETURNING id
  `)
  return result.rows.length > 0
}

export async function runInvoiceCron() {
  const started = Date.now()
  const result = { scanned: 0, issued: 0, failed: 0 }
  // Indexed selection and bounded memory; subsequent cron runs drain the rest.
  const pending = await db
    .select({ id: order.id })
    .from(order)
    .where(
      and(
        eq(order.status, "completed"),
        or(eq(order.invoiceStatus, "pending"), isNull(order.invoiceStatus)),
        notExists(
          db
            .select({ id: invoice.id })
            .from(invoice)
            .where(eq(invoice.orderId, order.id))
        )
      )
    )
    .orderBy(asc(order.id))
    .limit(BATCH_SIZE)

  for (const candidate of pending) {
    if (Date.now() - started >= RUN_BUDGET_MS) break
    result.scanned++
    try {
      await snapshotOrder(candidate.id)
    } catch (error) {
      result.failed++
      console.error("invoice.snapshot.failed", { orderId: candidate.id, error })
    }
  }

  for (let processed = 0; processed < BATCH_SIZE; processed++) {
    if (Date.now() - started >= RUN_BUDGET_MS) break
    const claimed = await claimInvoice()
    if (!claimed) break
    try {
      if (await renderInvoice(claimed.id, claimed.token)) result.issued++
    } catch (error) {
      result.failed++
      console.error("invoice.pdf.failed", { invoiceId: claimed.id, error })
      await db
        .update(invoice)
        .set({
          pdfLeaseToken: null,
          pdfError: "PDF generation failed; see server logs for details.",
          pdfNextAttemptAt: sql`now() + least(360, 5 * power(2, least(pdf_attempts - 1, 7))) * interval '1 minute'`,
        })
        .where(
          and(
            eq(invoice.id, claimed.id),
            eq(invoice.pdfLeaseToken, claimed.token)
          )
        )
    }
  }
  return result
}
