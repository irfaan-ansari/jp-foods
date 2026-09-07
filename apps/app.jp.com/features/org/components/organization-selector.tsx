"use client"

import React from "react"
import { Image } from "lucide-react"
import { authClient } from "@jp/auth/client"
import { QueryState } from "@jp/ui/components/jp"
import { Checkbox } from "@jp/ui/components/checkbox"
import { FieldLabel, FieldTitle } from "@jp/ui/components/field"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

type OrganizationSelectorProps = {
  selected: string | undefined
  onChange: (value: string) => void
}

export const OrganizationSelector = ({
  selected,
  onChange,
}: OrganizationSelectorProps) => {
  const { data, isPending, error } = authClient.useListOrganizations()

  return (
    <QueryState
      isPending={isPending}
      isError={!!error}
      error={error}
      isEmpty={data?.length === 0}
    >
      {data?.map((item) => {
        return (
          <FieldLabel
            key={item.id}
            htmlFor={item.id}
            className="relative flex w-full cursor-pointer rounded-lg px-2 py-1 hover:bg-primary/5"
          >
            <Checkbox
              id={item.id}
              checked={selected === item.id}
              className="absolute top-2 right-2 size-4 rounded-full"
              onCheckedChange={() => {
                onChange(item.id)
              }}
            />
            <Avatar>
              <AvatarImage src={item.logo!} alt={item.name} />
              <AvatarFallback>
                <Image className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <FieldTitle className="line-clamp-1">{item.name}</FieldTitle>
          </FieldLabel>
        )
      })}
    </QueryState>
  )
}
