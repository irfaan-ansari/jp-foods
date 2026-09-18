import { sql } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  jsonb,
  serial,
  integer,
  unique,
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
    unit: text("unit").notNull().default(""),
    price: text("price").notNull().default("0"),
    type: text("type").default(""),
    description: text("description").default(""),
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    status: text("status").default("active"),
    image: text("image").default(""),
    location: text("location"),
    trackInventory: boolean("track_inventory").default(false),
    stock: text("stock").default("0"),
    allowBackorder: boolean("allow_backorder").default(true),
    sellUnits: jsonb("sell_units")
      .$type<
        {
          name: string
          unitConversion: string
          minQuantity: string
          orderIncreament: string
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
    price:
      text(
        "price"
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
    lineItemCount: text("line_item_count"),
    lineItemQuantity: text("line_item_quantity"),
    lineItemTotal: text("line_item_total"),
    subtotal: text("subtotal").notNull(),
    taxableSubtotal: text("taxable_subtotal").notNull().default("0"),
    nonTaxableSubtotal: text("non_taxable_subtotal").notNull().default("0"),
    discount: text("discount").default("0").notNull(),
    taxName: text("tax_name"),
    taxRate: text("tax_rate"),
    taxAmount: text("tax_amount").default("0").notNull(),
    charges: jsonb("charges").$type<{
      type: string
      amount: string
    }>(),
    total: text("total").default("0").notNull(),
    po: text("po"),
    notes: text("notes"),
    deliveryDate: text("delivery_date"),
    deliveryWindow: text("delivery_window"),
    deliveryInstruction: text("delivery_instruction"),
    status: text("status")
      .notNull()
      .default("in_progress") /* active | completed */,
    paymentStatus: text("payment_status").notNull().default("pending"),
    invoiceStatus: text("invoice_status"),
    searchText: text("search_text").notNull().default(""),
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
    unitName: text("unit_name"),

    /** */
    categories: jsonb("categories")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`),
    price: text("price"),
    quantity: text("quantity"),
    inventoryQuantity: text("inventory_quantity"),
    subtotal: text("subtotal").default("0"),
    isTaxable: boolean("is_taxable").default(false),
    taxRate: text("tax_rate").default("0"),
    taxAmount: text("tax_amount").default("0"),
    total: text("total").default("0"),
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
    title: text("title") /** deprecated */,
    description: text("description") /** deprecated */,
    media: text("media"),
    badge: text("badge") /** deprecated */,
    action: text("action") /** add-to-cart | popup */,
    placement: jsonb("placement").$type<string[]>().default([]),
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
