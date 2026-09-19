import React from "react"
import Image from "next/image"
import { SITE_CONFIG } from "@/lib/config"
import { Avatar, AvatarImage } from "@jp/ui/components/avatar"
import Link from "next/link"

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-svh grid-cols-1 bg-linear-to-br from-primary to-lime-900 lg:grid-cols-[1fr_600px]">
      <div className="relative hidden flex-col pb-64 md:flex">
        <div className="w-full px-6 lg:px-16">
          <header className="flex gap-4 py-6">
            <Link href="/">
              <Avatar className="size-16 rounded-xl bg-secondary p-1">
                <AvatarImage
                  className="object-contain"
                  width={40}
                  height={40}
                  src={SITE_CONFIG.logo}
                  asChild
                >
                  <Image
                    width={40}
                    height={40}
                    src={SITE_CONFIG.logo}
                    alt="Jimenez Produce"
                  />
                </AvatarImage>
              </Avatar>
            </Link>
          </header>
          <span className="absolute right-20 bottom-20 size-72 animate-pulse rounded-full border-2 border-lime-300"></span>
          <span className="absolute right-44 bottom-44 size-40 animate-pulse rounded-full border-2 border-lime-100"></span>
          <div className="mt-16 flex h-full max-w-xl flex-col items-start gap-6">
            <div className="space-y-8 text-primary-foreground">
              <h2 className="font-heading text-7xl font-bold">
                Fresh ordering <br /> made simple
              </h2>
              <p className="max-w-xl text-lg text-pretty">
                Log in or register to your Jimezez Produce portal to place
                orders, view invoices, and manage deliveries with ease.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-auto p-2 lg:col-start-2">
        <div className="h-full rounded-2xl border bg-background shadow-lg backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
