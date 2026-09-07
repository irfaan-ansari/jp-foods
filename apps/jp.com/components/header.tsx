"use client"
import Link from "next/link"
import Image from "next/image"

import { SITE_CONFIG } from "@/lib/config"
import { usePathname } from "next/navigation"
import { Button } from "@jp/ui/components/button"
import { MobileNav } from "./mobile-nav"

export const Header = () => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || (pathname.startsWith(href) && href !== "/")
  }

  return (
    <header className="absolute inset-x-0 top-0 z-10 backdrop-blur-md">
      <div className="mx-auto px-8 py-2">
        <div className="flex h-14 w-full items-center lg:h-18">
          <div className="inline-flex flex-[1_1_0] self-center">
            <Link href="/">
              <Image
                width={100}
                height={100}
                alt="Logo"
                src={SITE_CONFIG.logo}
                className="w-18 lg:w-20"
              />
            </Link>
          </div>
          <nav className="hidden items-center justify-center lg:flex">
            <ul className="flex items-center gap-4">
              {SITE_CONFIG.pages.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    data-active={isActive(page.href)}
                    className="px-1.5 py-2.5 font-medium transition ease-out hover:text-primary data-[active=true]:text-primary"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden flex-[1_1_0] justify-end gap-4 lg:flex">
            {/* dynamically render  */}
            <Button asChild size="xl" className="bg-accent hover:bg-accent/90">
              <a href="/signin-otp" target="_blank">
                Log In
              </a>
            </Button>
            <Button asChild size="xl">
              <Link href="/apply">Apply for Account</Link>
            </Button>
          </div>
          <MobileNav isActive={isActive} />
        </div>
      </div>
    </header>
  )
}
