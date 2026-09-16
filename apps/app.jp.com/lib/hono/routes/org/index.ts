import { Hono } from "hono"

import { orders } from "@/features/org/order/order.api"
import { teamRoutes } from "@/features/org/team/team.api"
import { memberRoutes } from "@/features/org/member/member.api"
import { productRoute } from "@/features/org/product/product.api"
import { OrgAppContext, orgMiddleware } from "@/lib/hono/middlewares"
import { taxRulesRoutes } from "@/features/org/tax-rule/tax-rule.api"
import { orgRoutes as orgRoute } from "@/features/org/organization.api"
import { priceLevelRoutes } from "@/features/org/price-level/price-level.api"
import { orderGuideRoutes } from "@/features/org/order-guide/order-guide.api"
import { dashboardRoutes } from "@/features/org/dashboard/dashboard.api"

const app = new Hono<OrgAppContext>()

app.use("*", orgMiddleware)

export const orgRoutes = app
  .route("/dashboard", dashboardRoutes)
  .route("/", orgRoute)
  .route("/orders", orders)
  .route("/products", productRoute)
  .route("/teams", teamRoutes)
  .route("/order-guides", orderGuideRoutes)
  .route("/members", memberRoutes)
  .route("/price-levels", priceLevelRoutes)
  .route("/tax-rules", taxRulesRoutes)
