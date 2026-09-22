import React from "react"
import { auth } from "@jp/auth"
import { headers } from "next/headers"
import { AccountList } from "@/features/auth/components/account-list"
import { redirect } from "next/navigation"

const SelectAccountPage = async () => {
  const data = await auth.api.listDeviceSessions({
    headers: await headers(),
  })

  if (!data || data.length === 0) {
    redirect("/auth/signin")
  }

  return <AccountList data={data} />
}

export default SelectAccountPage
