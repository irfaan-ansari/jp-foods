import { PORTAL_URLS, UserRole } from "@jp/auth"
import { checkAuth } from "./lib/check-auth"
import { NextRequest, NextResponse } from "next/server"

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL

export default async function proxy(req: NextRequest) {
  if (!AUTH_URL) {
    throw new Error("NEXT_PUBLIC_AUTH_URL is not configured")
  }

  const { authenticated, authorized, session } = await checkAuth({
    portal: ["customer"],
  })

  if (!authenticated) {
    return NextResponse.redirect(new URL(AUTH_URL, req.nextUrl))
  }

  if (!authorized) {
    const role = session?.user.role as UserRole
    const url = PORTAL_URLS[role].url

    if (!role || !url) {
      return NextResponse.redirect(new URL(AUTH_URL, req.nextUrl))
    }

    return NextResponse.redirect(new URL(url, req.nextUrl))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
