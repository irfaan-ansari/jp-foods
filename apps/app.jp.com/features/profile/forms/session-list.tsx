"use client"
import React from "react"
import { useSessions } from "../profile.data"

export const SessionList = () => {
  const { data, isPending, error } = useSessions()
  console.log(data)
  return <div>SessionList</div>
}
