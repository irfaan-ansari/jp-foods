import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { organization, team, user } from "./auth"
import { lineItem, order, product } from "./organization"

type InvoiceTo = {
  street: string
  city: string
  state: string
  zip: string
  name: string
  email?: string
}

type ChargeLine = { type: string; amount: number }
type TaxLine = { type: string; amount: number; rate?: number }

export const invoice = pgTable(
  "invoice",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "restrict" }),
    teamId: text("team_id").references(() => team.id, { onDelete: "restrict" }),
    orderId: integer("order_id").references(() => order.id, {
      onDelete: "restrict",
    }),
    number: text("number").notNull(), // "INV-000123"
    status: text("status").notNull().default("issued"),
    billTo: jsonb("bill_to").$type<InvoiceTo>(),
    shipTo: jsonb("ship_to").$type<InvoiceTo>(),
    po: text("po"),
    dueDate: date("due_date"),
    paymentTerms: text("payment_terms"),
    charges: jsonb("charges").$type<ChargeLine[]>().default([]),
    tax: jsonb("tax")
      .$type<TaxLine>()
      .default({} as TaxLine),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    chargesTotal: numeric("charges_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    taxTotal: numeric("tax_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    amountPaid: numeric("amount_paid", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    creditApplied: numeric("credit_applied", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    notes: text("notes"),
    paidAt: timestamp("paid_at"),
    voidedAt: timestamp("voided_at"),
    voidedBy: text("voided_by").references(() => user.id, {
      onDelete: "set null",
    }),
    voidReason: text("void_reason"),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex("invoice_org_number_uq").on(t.organizationId, t.number),
    index("invoice_orderId_idx").on(t.orderId),
    index("invoice_teamId_idx").on(t.teamId),
    index("invoice_status_dueDate_idx").on(t.status, t.dueDate),
  ]
)

export const invoiceLineItem = pgTable(
  "invoice_line_item",
  {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id")
      .notNull()
      .references(() => invoice.id, { onDelete: "cascade" }),
    orderLineItemId: integer("order_line_item_id").references(
      () => lineItem.id,
      { onDelete: "set null" }
    ),
    productId: integer("product_id").references(() => product.id, {
      onDelete: "set null",
    }),
    itemCode: text("item_code"),
    title: text("title").notNull(),
    unitName: text("unit_name").notNull().default(""),
    unitQuantity: integer("unit_quantity"),
    quantity: numeric("quantity", { precision: 12, scale: 3 }).notNull(),
    price: numeric("price", { precision: 12, scale: 4 }).notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    isTaxable: boolean("is_taxable").notNull().default(false),
    taxRate: numeric("tax_rate", { precision: 6, scale: 4 })
      .notNull()
      .default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("invoiceLineItem_invoiceId_idx").on(t.invoiceId)]
)
