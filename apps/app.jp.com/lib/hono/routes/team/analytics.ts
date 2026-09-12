import { Hono } from "hono"

import { TeamAppContext } from "@/lib/hono/middlewares"
const app = new Hono<TeamAppContext>()

export const analytics = app
  .get("/overview", async (c) => {})
  .get("/recommended-products", async (c) => {})
  .get("/top-products", async (c) => {})
  .get("/top-categories", async (c) => {})
