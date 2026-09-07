import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { auth } from "@jp/auth"

const pathRoles = {
  "http://localhost:3001": ["admin", "manager", "owner"],
  "http://localhost:3000": ["customer"],
  "http://localhost:3003": ["driver"],
}

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = session?.session?.role ?? ""
  const destination = Object.entries(pathRoles).find(([, roles]) =>
    roles.includes(role)
  )?.[0]

  // if (destination) return NextResponse.redirect(destination)

  return NextResponse.next()
}

export const config = {
  matcher: ["/signin"],
}
