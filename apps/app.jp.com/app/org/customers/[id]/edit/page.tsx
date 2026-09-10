"use client"
import React from "react"
import { useParams } from "next/navigation"
import { useTeam } from "@/features/org/team/team.data"
import { PageContent, PageHeader } from "@/components/page-content"
import { TeamForm } from "@/features/org/team/form/team-form"
import { TeamFormValues } from "@/features/org/team/team.schema"

const EditCustomerPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isPending } = useTeam(id)

  const teamData = React.useMemo(() => {
    const team = data?.data
    if (!team) return {} as TeamFormValues
    const { street, city, state, zipcode } = team?.metadata || {}

    return {
      name: `${team?.name}`,
      managerName: `${team?.managerName}`,
      email: `${team?.email}`,
      phoneNumber: `${team?.phoneNumber}`,
      status: `${team?.status ?? "active"}`,
      creditEnabled: team?.creditEnabled || false,
      creditLimit: `${team?.creditLimit}`,
      taxRule: team?.taxRule,
      priceLevel: team?.priceLevel,
      salesRep: team?.salesRep,
      street: `${street}`,
      city: `${city}`,
      state: `${state}`,
      zipcode: `${zipcode}`,
      privateItems: team?.products,
      teamMembers: team?.teamMembers.map((mem) => ({ ...mem, id: mem.userId })),
    } as TeamFormValues
  }, [data])

  return (
    <React.Fragment>
      <PageHeader
        loading={isPending}
        backUrl="/org/customers"
        title="Edit Customer"
      />
      <PageContent loading={isPending}>
        <TeamForm values={teamData} id={id} />
      </PageContent>
    </React.Fragment>
  )
}

export default EditCustomerPage
