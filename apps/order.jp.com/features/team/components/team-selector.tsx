"use client"

import React from "react"
import { useTeams } from "../team.data"
import { Image } from "lucide-react"
import { QueryState } from "@jp/ui/components/jp"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"
import { FieldLabel, FieldTitle } from "@jp/ui/components/field"
import { Checkbox } from "@jp/ui/components/checkbox"

type TeamSelectorProps = {
  selected: string | undefined
  onChange: (value: { teamId: string; organizationId: string }) => void
}

export const TeamSelector = ({ selected, onChange }: TeamSelectorProps) => {
  const { data, isPending, isError } = useTeams()

  return (
    <QueryState isPending={isPending} isError={isError}>
      {data?.data?.map((team) => (
        <FieldLabel
          key={team.id}
          htmlFor={team.id}
          className="relative flex w-full cursor-pointer rounded-lg px-2 py-1 hover:bg-secondary has-data-checked:bg-secondary"
        >
          <Checkbox
            id={team.id}
            checked={selected === team.id}
            className="absolute top-2 right-2 size-4 rounded-full"
            onCheckedChange={() => {
              onChange({
                teamId: team.id,
                organizationId: team.organizationId,
              })
            }}
          />
          <Avatar>
            <AvatarImage src={team.logo!} alt={team.name} />
            <AvatarFallback>
              <Image className="size-3.5" />
            </AvatarFallback>
          </Avatar>
          <FieldTitle className="line-clamp-1">{team.name}</FieldTitle>
        </FieldLabel>
      ))}
    </QueryState>
  )
}
