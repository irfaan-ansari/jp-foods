import { Hono } from "hono"
import { db, jobApplication } from "@jp/db"
import { AppError } from "@jp/utils"
import { AppContext } from "@/lib/hono/middlewares"
import { and, count, eq, ilike, or } from "drizzle-orm"
import { parsePagination, getStatusCounts } from "@/lib/hono/lib"

const app = new Hono<AppContext>()

export const jobApplicationRoutes = app
  .get("/", async (c) => {
    const { q, status = "", ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const conditions = []

    if (status) {
      conditions.push(eq(jobApplication.status, status))
    }
    if (q) {
      conditions.push(
        or(
          ilike(jobApplication.applicantName, `%${q}%`),
          ilike(jobApplication.phone, `%${q}%`),
          ilike(jobApplication.email, `%${q}%`),
          ilike(jobApplication.position, `%${q}%`),
          ilike(jobApplication.location, `%${q}%`)
        )
      )
    }

    const [response, total] = await Promise.all([
      db.query.jobApplication.findMany({
        where: and(...conditions),
        limit,
        offset,
        orderBy: (c, { desc }) => [desc(c.createdAt)],
      }),
      db.$count(jobApplication, and(...conditions)),
    ])

    const transformed = response.map((res) => {
      const {
        cvUrl,
        dotBackUrl,
        dotFrontUrl,
        agreementUrl,
        signatureUrl,
        drivingLicenseBackUrl,
        drivingLicenseFrontUrl,
        socialSecurityBackUrl,
        socialSecurityFrontUrl,
        ...application
      } = res
      return {
        ...application,
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
        status: jobApplication.status,
        value: count(),
      })
      .from(jobApplication)

      .groupBy(jobApplication.status)

    const counts = getStatusCounts(result)

    return c.json({
      success: true,
      data: counts,
    })
  })

  // get application by id
  .get("/:id", async (c) => {
    const id = c.req.param("id")

    const response = await db.query.jobApplication.findFirst({
      where: (c, { eq }) => eq(c.id, Number(id)),
    })

    if (!response) throw new AppError("NOT_FOUND")

    const {
      cvUrl,
      dotBackUrl,
      dotFrontUrl,
      agreementUrl,
      signatureUrl,
      drivingLicenseBackUrl,
      drivingLicenseFrontUrl,
      socialSecurityBackUrl,
      socialSecurityFrontUrl,
      ...application
    } = response

    const transformed = {
      ...application,
      documents: [
        { label: "CV", field: "cvUrl", url: cvUrl },
        { label: "DOT Back", field: "dotBackUrl", url: dotBackUrl },
        { label: "DOT Front", field: "dotFrontUrl", url: dotFrontUrl },
        { label: "Agreement", field: "agreementUrl", url: agreementUrl },
        { label: "Signature", field: "signatureUrl", url: signatureUrl },
        {
          label: "Driving License Back",
          field: "drivingLicenseBackUrl",
          url: drivingLicenseBackUrl,
        },
        {
          label: "Driving License Front",
          field: "drivingLicenseFrontUrl",
          url: drivingLicenseFrontUrl,
        },
        {
          label: "Social Security Back",
          field: "socialSecurityBackUrl",
          url: socialSecurityBackUrl,
        },
        {
          label: "Social Security Front",
          field: "socialSecurityFrontUrl",
          url: socialSecurityFrontUrl,
        },
      ].filter((doc) => doc.url),
    }
    return c.json({
      success: true,
      data: transformed,
    })
  })
