import { Hono } from "hono"
import { customer, customerInvite, db } from "@jp/db"
import { AppError } from "@jp/utils"
import { AppContext } from "@/lib/hono/middlewares"
import { and, count, eq, ilike, or } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"

const app = new Hono<AppContext>()

export const customerApplicationRoutes = app
  .get("/", async (c) => {
    const { q, status = "", ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = []

    if (status) {
      conditions.push(eq(customer.status, status))
    }
    if (q) {
      conditions.push(
        or(
          ilike(customer.companyName, `%${q}%`),
          ilike(customer.companyPhone, `%${q}%`),
          ilike(customer.companyEmail, `%${q}%`),
          ilike(customer.companyEin, `%${q}%`),
          ilike(customer.officerEmail, `%${q}%`),
          ilike(customer.officerMobile, `%${q}%`)
        )
      )
    }

    const [response, total] = await Promise.all([
      db.query.customer.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: (c, { desc }) => [desc(c.createdAt)],
      }),
      db.$count(customer, and(...conditions)),
    ])

    const transformed = response.map((res) => {
      const { dlBackUrl, dlFrontUrl, signatureUrl, certificateUrl, ...rest } =
        res

      return {
        ...rest,
        documents: [
          {
            label: "Driver's License Front",
            field: "dlFrontUrl",
            url: dlFrontUrl,
          },
          {
            label: "Driver's License Back",
            field: "dlBackUrl",
            url: dlBackUrl,
          },

          {
            label: "Sale Tax/Certificate",
            field: "certificateUrl",
            url: certificateUrl,
          },
          {
            label: "Signature",
            field: "signatureUrl",
            url: signatureUrl,
          },
        ],
      }
    })
    return c.json({
      success: true,
      data: transformed,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
  // application count
  .get("/count", async (c) => {
    const result = await db
      .select({
        status: customer.status,
        value: count(),
      })
      .from(customer)

      .groupBy(customer.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
  // application invites
  .get("/invites", async (c) => {
    const { q, status, role, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    let conditions = []
    if (status) {
      conditions.push(eq(customerInvite.status, status))
    }
    if (q) {
      conditions.push(
        or(
          ilike(customerInvite.firstName, `%${q}%`),
          ilike(customerInvite.companyName, `%${q}%`),
          ilike(customerInvite.companyType, `%${q}%`),
          ilike(customerInvite.email, `%${q}%`)
        )
      )
    }
    const [response, total] = await Promise.all([
      db.query.customerInvite.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: (c, { desc }) => [desc(customerInvite.createdAt)],
      }),
      db.$count(customerInvite, and(...conditions)),
    ])

    return c.json({
      success: true,
      data: response,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })

  .get("/invites/count", async (c) => {
    const result = await db
      .select({
        status: customerInvite.status,
        value: count(),
      })
      .from(customerInvite)
      .groupBy(customerInvite.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })
  // get application by id
  .get("/:id", async (c) => {
    const id = c.req.param("id")

    const response = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, Number(id)),
    })

    if (!response) throw new AppError("NOT_FOUND")

    const { dlBackUrl, dlFrontUrl, signatureUrl, certificateUrl, ...rest } =
      response

    const transformed = {
      ...rest,
      documents: [
        {
          label: "Driver's License Front",
          field: "dlFrontUrl",
          url: dlFrontUrl,
        },
        {
          label: "Driver's License Back",
          field: "dlBackUrl",
          url: dlBackUrl,
        },

        {
          label: "Sale Tax/Certificate",
          field: "certificateUrl",
          url: certificateUrl,
        },
        {
          label: "Signature",
          field: "signatureUrl",
          url: signatureUrl,
        },
      ],
    }
    return c.json({
      success: true,
      data: transformed,
    })
  })

  .get("/invites/:id", async (c) => {})
