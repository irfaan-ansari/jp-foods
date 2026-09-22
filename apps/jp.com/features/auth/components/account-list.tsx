"use client"

import React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { authClient } from "@jp/auth/client"
import { type DeviceSessions } from "@jp/auth"
import { Button } from "@jp/ui/components/button"
import { FieldGroup } from "@jp/ui/components/field"
import { ArrowRight, Loader2, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@jp/ui/components/avatar"

export const AccountList = ({ data }: { data: DeviceSessions }) => {
  const [loading, setLoading] = React.useState("")

  async function handleSelect(sessionToken: string) {
    setLoading(sessionToken)
    const { error } = await authClient.multiSession.setActive({
      sessionToken,
    })
    if (error) {
      setLoading("")
      toast.error(error.message)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6 py-20 lg:px-16">
      <FieldGroup>
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold">Choose an account</h2>
          <p className="text-sm text-muted-foreground">
            to continue to the Jimezez Produce portal.
          </p>
        </div>
        <ul className="-mx-2.5 grid gap-2">
          {data?.map(({ session, user }) => (
            <li key={session.token}>
              <Button
                variant="outline"
                className="h-auto w-full cursor-pointer justify-start rounded-2xl border-transparent bg-secondary py-2.5 text-left"
                onClick={() => handleSelect(session.token)}
                disabled={loading === session.token}
              >
                <Avatar className="size-10">
                  <AvatarImage src={user.image!} alt={user.name} />
                  <AvatarFallback />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                {loading === session.token ? (
                  <Loader2 className="animate-spin text-muted-foreground" />
                ) : (
                  <ArrowRight className="size-4 -translate-x-1.5 self-center text-muted-foreground transition group-hover/button:translate-x-0" />
                )}
              </Button>
            </li>
          ))}
        </ul>
        <Button asChild size="xl">
          <Link href="/auth/signin">
            <UserPlus />
            Add another account
          </Link>
        </Button>
      </FieldGroup>
    </div>
  )
}
