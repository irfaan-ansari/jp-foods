import { Hono } from "hono"
import { OrgAppContext, orgPermission } from "@/lib/hono/middlewares"
import { db } from "@jp/db"

const app = new Hono<OrgAppContext>()

app.use("/", orgPermission({ organization: ["update"] }))

export const orgRoutes = app.get("/", async (c) => {
  const organizationId = c.get("organizationId")

  const response = await db.query.organization.findFirst({
    where: (o, { eq }) => eq(o.id, organizationId),
  })

  let metadata = {}
  if (response?.metadata && typeof response.metadata === "string") {
    try {
      metadata = JSON.parse(response.metadata)
    } catch {
      metadata = {}
    }
  }

  return c.json({
    success: true,
    data: { ...response, metadata },
  })
})
