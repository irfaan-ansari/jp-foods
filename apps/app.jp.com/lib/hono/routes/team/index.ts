import { Hono } from "hono"

import { AppContext, teamMiddleware } from "@/lib/hono/middlewares"
import { teams } from "./teams"
import { orders } from "./orders"
import { guides } from "./guides"
import { members } from "./members"
import { products } from "./products"
import { promotions } from "./promotions"
import { analytics } from "./analytics"

const app = new Hono<AppContext>()

// create a customer specify route to list the teams even if the team is not selected
export const teamRoutes = app
  .route("/", teams)
  .use("*", teamMiddleware)
  .route("/analytics", analytics)
  .route("/promotions", promotions)
  .route("/orders", orders)
  .route("/products", products)
  .route("/guides", guides)
  .route("/members", members)
  .route("/invoices", teams)
  .route("/payments", teams)
