import React from "react"
import { Spinner } from "@jp/ui/components/jp/empty-state"

const LoadingPage = () => {
  return (
    <div className="flex h-svh flex-col items-center justify-center">
      <Spinner />
    </div>
  )
}

export default LoadingPage
