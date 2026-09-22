import { checkAuth } from "./lib/check-auth"
import { NextRequest, NextResponse } from "next/server"

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL

export default async function proxy(req: NextRequest) {
  if (!AUTH_URL) {
    throw new Error("NEXT_PUBLIC_AUTH_URL is not configured")
  }

  const { authenticated, authorized } = await checkAuth({
    portal: ["customer"],
  })

  if (!authenticated || !authorized) {
    return NextResponse.redirect(new URL(AUTH_URL, req.nextUrl))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
