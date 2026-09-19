import Link from "next/link"
import { Bell, Plus } from "lucide-react"

import { Button } from "@jp/ui/components/button"

import { PageContent, PageHeader } from "@/components/page-content"
import { DashboardClient } from "@/features/dashboard/components/dashboard-client"
import { Promotion } from "@/features/promotion/components/promotion"

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard">
        <Button size="lg" asChild>
          <Link href="/create/all">
            <Plus /> New order
          </Link>
        </Button>
      </PageHeader>

      <PageContent>
        <Promotion placement="banner" />
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Review your account activity or start a new order.
          </p>
        </div>
        <DashboardClient />
      </PageContent>
    </>
  )
}
