"use client"
import Link from "next/link"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { SITE_CONFIG } from "@/lib/config"
import { usePathname } from "next/navigation"
import { Button } from "@jp/ui/components/button"
import { ArrowRight } from "lucide-react"

export const Header = () => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || (pathname.startsWith(href) && href !== "/")
  }

  return (
    <header className="sticky top-0 z-10 bg-background shadow-md backdrop-blur-md">
      <div className="mx-auto max-w-8xl px-4 py-3 lg:px-8">
        <div className="flex h-14 w-full items-center gap-3 lg:h-16 lg:gap-6">
          <div className="inline-flex flex-[1_1_0] self-center">
            <Link href="/">
              <Image
                width={100}
                height={100}
                alt="Logo"
                src={SITE_CONFIG.logo}
                className="w-14 lg:w-20"
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
          <Button asChild size="xl" className="lg:hidden">
            <a href="/auth/signin" target="_blank">
              Place Order
            </a>
          </Button>
          <div className="hidden flex-[1_1_0] justify-end gap-4 lg:flex">
            <Button asChild size="xl">
              <a href="/auth/signin" target="_blank">
                Place Order
                <ArrowRight />
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              className="bg-sidebar-accent hover:bg-sidebar-accent/90"
            >
              <Link href="/apply">
                Apply for an Account <ArrowRight />
              </Link>
            </Button>
          </div>
          <MobileNav isActive={isActive} />
        </div>
      </div>
    </header>
  )
}
