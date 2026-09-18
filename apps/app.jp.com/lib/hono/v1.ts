import { Hono } from "hono"
import { userRoutes } from "@/features/user/user.api"
import { productRoutes } from "./routes/product"
import { crmRoutes } from "./routes/crm"
import { orgRoutes } from "./routes/org"
import { teamRoutes } from "./routes/team"
import { driverRoutes } from "./routes/driver"
import { uploadRoutes } from "./routes/uploads"

export const v1 = new Hono()
  // public routes
  .route("/upload", uploadRoutes)
  .route("/products", productRoutes)

  // admin routes
  .route("/users", userRoutes)
  .route("/crm", crmRoutes)
  .route("/org", orgRoutes)
  .route("/driver", driverRoutes)
  // ordering routes
  .route("/team", teamRoutes)
