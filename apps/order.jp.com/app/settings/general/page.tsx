"use client"

import React from "react"

import { useActiveTeam } from "@/features/team/team.data"
import { TeamForm } from "@/features/team/forms/team-form"
import { ErrorState, PageContentSkeleton } from "@jp/ui/components/jp"

const GeneralPage = () => {
  const { data, isPending, isError, error } = useActiveTeam()

  const {
    id = "",
    name = "",
    logo = "",
    phoneNumber = "",
    email = "",
    metadata = {},
  } = data?.data || {}

  const { street = "", city = "", state = "", zip = "" } = metadata || {}

  if (isPending) return <PageContentSkeleton />

  if (isError)
    return <ErrorState title={error.message} description={error.message} />

  return (
    <TeamForm
      id={id}
      defaultValues={{
        logo: logo as string,
        name,
        phoneNumber,
        email,
        street,
        city,
        state,
        zip,
      }}
    />
  )
}

export default GeneralPage
