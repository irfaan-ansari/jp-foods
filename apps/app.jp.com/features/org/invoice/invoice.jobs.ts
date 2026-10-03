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
  return true
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

  return started
}
