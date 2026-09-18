import Link from "next/link"
import Image from "next/image"

import { Container } from "@/components/container"
import { SITE_CONFIG } from "@/lib/config"
import { AtSign, MapPinned, Phone } from "lucide-react"
import { CONTACT_SECTIONS, COVERAGE_LOCATIONS, HOME_SECTIONS } from "@/data/web"

export const Footer = () => {
  return (
    <footer className="bg-secondary py-16">
      <Container>
        <div className="grid grid-cols-9 gap-8">
          {/* branding */}
          <div className="col-span-9 space-y-8 md:col-span-3">
            <Link href="/" className="inline-block">
              <Image
                width={100}
                height={100}
                alt="Logo"
                src={SITE_CONFIG.logo}
                className="aspect-square w-full max-w-20 object-contain"
              />
            </Link>
            <div className="flex flex-col gap-6">
              {CONTACT_SECTIONS.locations.map((loc) => (
                <div className="space-y-2" key={loc.name}>
                  <h5 className="text-lg font-semibold">{loc.name}</h5>
                  <div className="space-y-1">
                    {loc.phone && (
                      <div className="flex items-center gap-2">
                        <span className="bg-highlight inline-flex size-8 items-center justify-center rounded-full text-primary-foreground shadow-sm">
                          <Phone className="size-4" />
                        </span>
                        <a
                          href={`tel:${loc.phone}`}
                          className="text-muted-foreground transition ease-out hover:text-foreground hover:underline"
                        >
                          {loc.phone}
                        </a>
                      </div>
                    )}
                    {loc.email && (
                      <div className="flex items-center gap-2">
                        <span className="bg-highlight inline-flex size-8 items-center justify-center rounded-full text-primary-foreground shadow-sm">
                          <AtSign className="size-4" />
                        </span>
                        <a
                          href={`mailto:${loc.email}`}
                          className="text-muted-foreground transition ease-out hover:text-foreground hover:underline"
                        >
                          {loc.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="bg-highlight inline-flex size-8 items-center justify-center rounded-full text-primary-foreground shadow-sm">
                        <MapPinned className="size-4" />
                      </span>
                      <p className="text-muted-foreground">{loc.street}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* categories */}
          <div className="col-span-9 md:col-span-2">
            <div className="space-y-6">
              <h5 className="font-heading font-medium uppercase">Categories</h5>
              <div className="flex flex-col gap-2">
                {HOME_SECTIONS.categories.map((cat) => (
                  <Link
                    key={cat.title}
                    href={`/products?cat=${encodeURIComponent(cat.title)}`}
                    className="py-1 transition ease-out hover:text-primary hover:underline"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* coverage area */}
          <div className="col-span-9 md:col-span-2">
            <div className="space-y-6">
              <h5 className="font-heading font-medium uppercase">
                Coverage Area
              </h5>
              <div className="flex flex-col gap-2">
                {COVERAGE_LOCATIONS.slice(0, 8).map((covrage) => (
                  <span
                    key={`${covrage.label}${covrage.lng}`}
                    className="py-1 opacity-80"
                  >
                    {covrage.label}
                  </span>
                ))}
                <Link
                  href="/about"
                  className="py-1 transition ease-out hover:text-primary hover:underline"
                >
                  More...
                </Link>
              </div>
            </div>
          </div>

          {/* menu */}
          <div className="col-span-9 md:col-span-2">
            <div className="space-y-6">
              <h5 className="font-heading font-medium uppercase">Menu</h5>
              <div className="flex flex-col gap-2">
                {SITE_CONFIG.pages.map((page) => (
                  <Link
                    key={page.label}
                    href={page.href}
                    className="py-1 transition ease-out hover:text-primary hover:underline"
                  >
                    {page.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between sm:flex-row">
          <div>
            &copy; <CurrentYear /> {SITE_CONFIG.name} • All rights reserved
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/terms-and-conditions"
              className="transition ease-out hover:text-primary hover:underline"
            >
              Terms and Condtions
            </Link>
            <span>•</span>
            <Link
              href="/privacy-policy"
              className="transition ease-out hover:text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

const CurrentYear = () => {
  const year = new Date().getFullYear()
  return <time>{year}</time>
}
