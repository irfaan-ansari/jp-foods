import { Hono } from "hono"
import { getCookie, setCookie, deleteCookie } from "hono/cookie"
import { db, product } from "@jp/db"
import { parsePagination } from "../lib/parse-pagination"
import {
  and,
  arrayContains,
  countDistinct,
  eq,
  ilike,
  like,
  sql,
} from "drizzle-orm"

const COOKIE_NAME = `JP_product_access`

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  path: "/",
}

async function validateToken(token: string) {
  return db.query.customerInvite.findFirst({
    where: (ci, { eq }) => eq(ci.token, token),
  })
}

export const productRoutes = new Hono()
  .use("*", async (c, next) => {
    c.header("Cache-Control", "no-store")
    c.header("Referrer-Policy", "no-referrer")
    await next()
  })

  .get("/access", async (c) => {
    const token = c.req.query("token")
    const callbackURL = c.req.query("redirect")

    if (!callbackURL) {
      return c.json({ message: "Callback URL is required." }, 400)
    }
    if (!token) {
      return c.json({ message: "Access token is required." }, 400)
    }

    const access = await validateToken(token)

    if (!access) {
      return c.json({ message: "This link is invalid or expired." }, 401)
    }

    setCookie(c, COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60,
    })

    return c.redirect(callbackURL, 303)
  })

  .get("/", async (c) => {
    const token = getCookie(c, COOKIE_NAME)
    const valid = token ? await validateToken(token) : null

    const { q, cat, ...rest } = c.req.query()
    const { page, limit, offset } = parsePagination(rest)

    const filters = and(
      eq(product.status, "active"),
      like(product.image, "https://%"),
      q ? ilike(product.searchText, `%${q}%`) : undefined,
      cat ? arrayContains(product.categories, [cat]) : undefined
    )

    if (!valid) {
      deleteCookie(c, COOKIE_NAME, cookieOptions)
    }

    const [products, [count]] = await Promise.all([
      db
        .selectDistinctOn([product.itemCode], {
          id: product.id,
          title: product.title,
          description: product.description,
          image: product.image,
          categories: product.categories,
        })
        .from(product)
        .where(filters)
        .orderBy(product.itemCode, product.id)
        .limit(valid ? limit : 24)
        .offset(valid ? offset : 0),
      db
        .select({ total: countDistinct(product.itemCode) })
        .from(product)
        .where(filters),
    ])
    const total = count?.total ?? 0

    return c.json({
      success: true,
      authorized: !!valid,
      data: products,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  })
