"use client"

import { toast } from "sonner"
import { useState } from "react"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@jp/ui/components/button"
import { submitAgreement } from "@/features/careers/agreement.action"

export const JobAgreementButton = ({ token }: { token: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const { success, error } = await submitAgreement(token)
    if (success) {
      toast.success("Agreement Submitted Successfully")
      router.replace("/")
      return
    }

    toast.error(error.message || "Failed to submit agreement")
    setLoading(false)
  }

  return (
    <Button
      className="w-full"
      size="xl"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? <Loader className="animate-spin" /> : "Agree and Continue"}
    </Button>
  )
}
