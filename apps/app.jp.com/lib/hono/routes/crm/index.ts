import { Hono } from "hono"

import { AppContext } from "@/lib/hono/middlewares/context"
import { customerApplicationRoutes } from "@/features/crm/customer/customer.api"
import { jobApplicationRoutes } from "@/features/crm/candidate/candidate.api"
import { catalogInquiryRoutes } from "@/features/crm/catalog/catalog.api"

const crmRoutes = new Hono<AppContext>()

crmRoutes.route("/customers", customerApplicationRoutes)
crmRoutes.route("/candidates", jobApplicationRoutes)
crmRoutes.route("/catalog-inquiries", catalogInquiryRoutes)
crmRoutes.route("/contact", customerApplicationRoutes)

export { crmRoutes }
