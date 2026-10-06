"use client"

import { useActiveTeam } from "@/features/team/team.data"
import { Skeleton } from "@jp/ui/components/skeleton"
import { ArrowRight, Letter, Phone } from "@solar-icons/react"

export const SupportContact = () => {
  const { data, isPending } = useActiveTeam()

  const email = data?.data?.organization?.email
  const phoneNumber = data?.data?.organization?.phoneNumber

  return (
    <section
      aria-label="Quick contact"
      aria-busy={isPending}
      className="grid gap-4 sm:grid-cols-2"
    >
      <a
        href={!isPending && phoneNumber ? `tel:${phoneNumber}` : undefined}
        aria-disabled={isPending || !phoneNumber}
        className="group flex items-center gap-4 rounded-2xl border bg-background p-5 transition hover:border-primary/40 hover:bg-secondary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Phone className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Call support</p>
          {isPending ? (
            <Skeleton className="mt-1 h-5 w-32 max-w-full" />
          ) : (
            <p className="mt-1 font-semibold">{phoneNumber}</p>
          )}
        </div>
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
      <a
        href={!isPending && email ? `mailto:${email}` : undefined}
        aria-disabled={isPending || !email}
        className="group flex items-center gap-4 rounded-2xl border bg-background p-5 transition hover:border-primary/40 hover:bg-secondary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
          <Letter className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">Email support</p>
          {isPending ? (
            <Skeleton className="mt-1 h-5 w-48 max-w-full" />
          ) : (
            <p className="mt-1 font-semibold break-all">{email}</p>
          )}
        </div>
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
    </section>
  )
}
