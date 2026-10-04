import { sql } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  jsonb,
  numeric,
  serial,
  integer,
  unique,
  date,
} from "drizzle-orm/pg-core"
import { organization, team, user } from "./auth"

/* -----------------------------
   Product Table
----------------------------- */
export const product = pgTable(
  "product",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "cascade",
    }),
    itemCode: text("item_code").notNull(),

    type: text("type").default(""),
    description: text("description").default(""),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    status: text("status").default("active"),
    image: text("image").default(""),
    location: text("location"),
    trackInventory: boolean("track_inventory").default(false),
    stock: numeric("stock", { precision: 12, scale: 4 }).default("0"),
    allowBackorder: boolean("allow_backorder").default(true),

    stockUOM: text("stock_uom").default("lb"),
    packSize: numeric("pack_size", { precision: 12, scale: 4 }).default("1"),
    sellUOM: text("sell_uom").default("lb"),
    catchWeight: boolean("catch_weight"),
    displayLabel: text("display_label").default(""),
    pricingBasis: text("pricing_basis").default("fixed"),
    // "fixed" = per sell unit eg: $60 case price
    //  "per-unit" = per stock unit eg: 2.5 lb
    //  "catch-weight" = per stock unit eg: 2.5 lb final will be calculated while completing the order
    price: numeric("price", { precision: 12, scale: 2 }).default("0"),
    splitUnits: jsonb("split_units")
      .$type<
        {
          name: string
          displayLabel: string
          sellUnitPrice: number
          unitConversion: number
        }[]
      >()
      .default(sql`'[]'::jsonb`),
    sellingUnits: jsonb("selling_units")
      .$type<
        {
          name: string
          displayLabel: string
          price: number
          qtyPerUnit: number
          minOrderQty: number
          orderIncrement: number
          isDefault: boolean
        }[]
      >()
      .default(sql`'[]'::jsonb`),
    images: jsonb("images")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    searchText: text("search_text"),
    isTaxable: boolean("is_taxable").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("products_status_idx").on(table.status),
    index("products_organization_id_idx").on(table.organizationId),
    index("products_category_idx").on(table.categories),
    unique("products_organization_id_item_code_idx").on(
      table.organizationId,
      table.itemCode
    ),
    index("products_name_trgm_idx").using(
      "gin",
      table.searchText.op("gin_trgm_ops")
    ),
  ]
)

export const priceLevel = pgTable("price_level", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  adjustmentType: text("adjustment_type").notNull(), // "fixed" | "percentage"
  appliesTo: text("applies_to").default("all").notNull(), // "all" | "per_item"
  adjustmentValue: text("adjustment_value").notNull(), // +10, -10, 50 etc
  status: text("status").default("active").notNull(), // "active" | "inactive"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

/* -----------------------------
   price level items
----------------------------- */
export const priceLevelItem = pgTable(
  "price_level_item",
  {
    id: serial("id").primaryKey(),
    priceLevelId: integer("price_level_id").notNull(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
      }),
    adjustmentValue:
      text(
        "adjustment_value"
      ).notNull() /** adjustmentType == percentage ? increase or decrease by percent  */,
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("price_level_item_priceLevelId_idx").on(table.priceLevelId),
    index("price_level_item_productId_idx").on(table.productId),
    unique("price_level_product_unique").on(
      table.priceLevelId,
      table.productId
    ),
  ]
)

/* -----------------------------
  team product
----------------------------- */
export const teamProduct = pgTable(
  "team_product",
  {
    id: serial("id").primaryKey(),
    teamId: text("team_id").references(() => team.id, {
      onDelete: "cascade",
    }),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("team_product_teamId_idx").on(table.teamId),
    index("team_product_productId_idx").on(table.productId),
    unique("team_product_unique").on(table.teamId, table.productId),
  ]
)

/* -----------------------------
   Tax Rules
----------------------------- */
export const taxRule = pgTable("tax_rule", {
  id: serial("id").primaryKey(),
  organizationId: text("organization_id").references(() => organization.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  rate: text("rate").notNull(),
  priority: integer("priority").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

/* -----------------------------
   order guides schema
----------------------------- */
export const orderGuide = pgTable(
  "order_guide",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, {
        onDelete: "cascade",
      }),
    teamId: text("team_id").references(() => team.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    position: integer("position").notNull().default(0),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("order_guides_team_idx").on(table.teamId),
    index("order_guides_organization_id_idx").on(table.organizationId),
  ]
)

/* -----------------------------
   order guide item schema
----------------------------- */
export const orderGuideItem = pgTable(
  "order_guide_item",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "cascade",
      }),
    orderGuideId: integer("order_guide_id").references(() => orderGuide.id, {
      onDelete: "cascade",
    }),
    quantity: text("quantity"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("order_guide_item_productId_idx").on(table.productId),
    index("order_guide_item_order_guide_id_idx").on(table.orderGuideId),
    unique("order_guide_item_orderGuide_product_unique").on(
      table.orderGuideId,
      table.productId
    ),
  ]
)
/* -----------------------------
   order schema
----------------------------- */
export const order = pgTable(
  "order",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "set null",
    }),
    teamId: text("team_id").references(() => team.id, {
      onDelete: "set null",
    }),
    userId: text("user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    shippingAddress: jsonb("shipping_address").$type<{
      street: string
      city: string
      state: string
      zip: string
    }>(),
    lineItemCount: integer("line_item_count"),
    lineItemQuantity: numeric("line_item_quantity", {
      precision: 12,
      scale: 4,
    }),
    lineItemTotal: numeric("line_item_total", { precision: 12, scale: 2 }),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    taxableSubtotal: numeric("taxable_subtotal", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    nonTaxableSubtotal: numeric("non_taxable_subtotal", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0"),
    discount: numeric("discount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    taxName: text("tax_name"),
    taxRate: numeric("tax_rate", { precision: 8, scale: 4 }),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    charges: jsonb("charges").$type<{
      type: string
      amount: string
    }>(),
    total: numeric("total", { precision: 12, scale: 2 }).default("0").notNull(),
    po: text("po"),
    notes: text("notes"),
    deliveryDate: date("delivery_date"),
    deliveryWindow: text("delivery_window"),
    deliveryInstruction: text("delivery_instruction"),
    status: text("status")
      .notNull()
      .default("in_progress") /* in_progress | completed | cancelled */,
    invoiceStatus:
      text("invoice_status").default("pending") /** pending | invoiced | */,
    deliveredAt: timestamp("delivered_at"),
    cancelledAt: timestamp("cancelled_at"),
    cancelledBy: text("cancelled_by").references(() => user.id, {
      onDelete: "set null",
    }),
    cancelReason: text("cancel_reason"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("order_organizationId_idx").on(table.organizationId),
    index("order_teamId_idx").on(table.teamId),
    index("order_status_idx").on(table.status),
    index("order_invoice_queue_idx").on(
      table.status,
      table.invoiceStatus,
      table.id
    ),
    index("order_userId_idx").on(table.userId),
  ]
)

export const lineItem = pgTable(
  "line_item",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "set null",
    }),
    teamId: text("team_id").references(() => team.id, {
      onDelete: "set null",
    }),
    orderId: integer("order_id").references(() => order.id, {
      onDelete: "set null",
    }),
    productId: integer("product_id").references(() => product.id, {
      onDelete: "set null",
    }),
    title: text("title"),
    image: text("image"),
    type: text("type"),
    location: text("location"),
    itemCode: text("item_code"),

    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),

    unitName: text("unit_name").notNull().default(""),
    unitLabel: text("unit_label").default(""),
    uom: text("uom"),
    qtyPerUnit: integer("qty_per_unit").notNull().default(1),
    catchWeight: boolean("catch_weight").default(false),
    price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
    calculatedPrice: numeric("calculated_price", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    unitQuantity: numeric("unit_quantity", { precision: 12, scale: 2 })
      .notNull()
      .default("0") /** used for inventory */,
    quantity: numeric("quantity", { precision: 12, scale: 4 })
      .notNull()
      .default("1"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).default("0"),
    isTaxable: boolean("is_taxable").default(false),
    taxRate: numeric("tax_rate", { precision: 8, scale: 4 }).default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).default("0"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("lineItem_organizationId_idx").on(table.organizationId),
    index("lineItem_teamId_idx").on(table.teamId),
  ]
)

export const promotion = pgTable(
  "promotion",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, {
        onDelete: "cascade",
      }),
    name: text("name") /** internal refrence only */,
    media: text("media"),
    action: text("action") /** add-to-cart | popup | null */,
    placement: jsonb("placement")
      .$type<string[]>()
      .default([]) /** sidebar | new-order | banner */,
    triggerProductIds: jsonb("trigger_product_ids")
      .$type<number[]>()
      .default([]),
    productIds: jsonb("product_ids").$type<number[]>().default([]),
    target: text("target").default("all").notNull() /** all | selected */,
    status: text("status").default("active").notNull() /** active | inactive */,
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("promotion_organizationId_idx").on(table.organizationId)]
)

export const promotionTarget = pgTable(
  "promotion_target",
  {
    id: serial("id").primaryKey(),
    promotionId: integer("promotion_id")
      .notNull()
      .references(() => promotion.id, {
        onDelete: "cascade",
      }),
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("promotion_target_promotionId_idx").on(table.promotionId),
    index("promotion_target_teamId_idx").on(table.teamId),
    unique("promotion_target_promotion_team_unique").on(
      table.promotionId,
      table.teamId
    ),
  ]
)

export const messageCampaign = pgTable(
  "message_campaign",
  {
    id: serial("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    channel: text("channel").notNull().default("sms"),
    status: text("status").notNull().default("draft"),
    templateKey: text("template_key"),
    message: text("message").notNull(),
    variables: jsonb("variables")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    recipientSource: text("recipient_source").notNull().default("mixed"),
    recipientCount: integer("recipient_count").notNull().default(0),
    sentCount: integer("sent_count").notNull().default(0),
    failedCount: integer("failed_count").notNull().default(0),
    skippedCount: integer("skipped_count").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    sentAt: timestamp("sent_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("message_campaign_organization_id_idx").on(table.organizationId),
    index("message_campaign_status_idx").on(table.status),
    index("message_campaign_created_by_idx").on(table.createdBy),
  ]
)

export const messageRecipient = pgTable(
  "message_recipient",
  {
    id: serial("id").primaryKey(),
    campaignId: integer("campaign_id")
      .notNull()
      .references(() => messageCampaign.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    name: text("name"),
    phoneNumber: text("phone_number").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("queued"),
    provider: text("provider").notNull().default("twilio"),
    providerMessageId: text("provider_message_id"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    variables: jsonb("variables")
      .$type<Record<string, string>>()
      .default(sql`'{}'::jsonb`),
    sentAt: timestamp("sent_at"),
    failedAt: timestamp("failed_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("message_recipient_campaign_id_idx").on(table.campaignId),
    index("message_recipient_organization_id_idx").on(table.organizationId),
    index("message_recipient_status_idx").on(table.status),
    index("message_recipient_phone_number_idx").on(table.phoneNumber),
  ]
)
