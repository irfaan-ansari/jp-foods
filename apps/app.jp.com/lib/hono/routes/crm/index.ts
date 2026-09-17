import { Hono } from "hono"

import { AppContext } from "@/lib/hono/middlewares/context"
import { customerApplicationRoutes } from "@/features/crm/customer/customer.api"
import { jobApplicationRoutes } from "@/features/crm/candidate/candidate.api"
import { catalogInquiryRoutes } from "@/features/crm/catalog/catalog.api"
import { authMiddleware } from "@/lib/hono/middlewares/auth"

const crmRoutes = new Hono<AppContext>()
  .use("*", authMiddleware({ portal: ["crm"] }))
  .route("/customers", customerApplicationRoutes)
  .route("/candidates", jobApplicationRoutes)
  .route("/catalog-inquiries", catalogInquiryRoutes)
  .route("/contact", customerApplicationRoutes)

export { crmRoutes }
