import { Hono } from "hono"

import { AppContext } from "@/lib/hono/middlewares"

const driver = new Hono<AppContext>()

driver.get("/driver", (c) => {
  return c.json({
    message: "Hello driver route",
  })
})

export { driver }
