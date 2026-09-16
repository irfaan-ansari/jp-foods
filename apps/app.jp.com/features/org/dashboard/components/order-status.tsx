import type { ReactNode } from "react"
import DashboardCard from "@/features/crm/dashboard/components/dashboard-card"
import type { Status } from "@/features/shared/shared.data"
import { STATUS } from "../../order/order.const"

const segments = Object.values(STATUS).filter((status) => status.value)

export function OrderStatus({
  data,
  loading,
  error,
  children,
}: {
  data: Status
  loading: boolean
  error: boolean
  children: ReactNode
}) {
  return (
    <DashboardCard
      title="Orders"
      description="All-time status breakdown"
      href="/org/orders"
      segments={segments}
      data={data}
      loading={loading}
      error={error}
    >
      {children}
    </DashboardCard>
  )
}
