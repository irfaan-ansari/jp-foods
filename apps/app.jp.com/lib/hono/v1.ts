import { Hono } from "hono"

import { orgRoutes } from "./routes/org"
import { crmRoutes } from "./routes/crm"
import { teamRoutes } from "./routes/team"
import { driver } from "./routes/driver"

import { authMiddleware } from "./middlewares"
import { userRoutes } from "@/features/user/user.api"

const appRoutes = new Hono().route("/", userRoutes)

// admin applications
const crmApp = new Hono()
  .use("*", authMiddleware({ portal: ["crm"] }))
  .route("/", crmRoutes)

// admin organization
const orgApp = new Hono()
  .use("*", authMiddleware({ portal: ["organization"] }))
  .route("/", orgRoutes)

// customer ordering
const teamApp = new Hono()
  .use("*", authMiddleware({ portal: ["customer"] }))
  .route("/", teamRoutes)

// driver management
const driverApp = new Hono()
  .use("*", authMiddleware({ portal: ["driver"] }))
  .route("/", driver)

export const v1 = new Hono()
  .route("/users", appRoutes)
  // application etc.
  .route("/crm", crmApp)
  // admin ordering
  .route("/org", orgApp)
  // customer ordering
  .route("/team", teamApp)
  // future implementation
  .route("/driver", driverApp)
