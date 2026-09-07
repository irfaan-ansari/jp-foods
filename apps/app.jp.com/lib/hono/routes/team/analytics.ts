import { Hono } from "hono"

import { db, orderGuide } from "@jp/db"
import { eq } from "drizzle-orm"
import { parsePagination } from "@jp/utils"
import { TeamAppContext } from "@/lib/hono/middlewares"
import { getTeamPriceResolver } from "@/features/org/price-level/price-level.resolver"

const app = new Hono<TeamAppContext>()

export const analytics = app
  .get("/overview", async (c) => {})
  .get("/recommended-products", async (c) => {})
  .get("/top-products", async (c) => {})
  .get("/top-categories", async (c) => {})
