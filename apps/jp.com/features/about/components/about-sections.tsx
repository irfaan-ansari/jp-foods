import {
  ArrowUpRight,
  CheckCheck,
  Handshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Warehouse,
} from "lucide-react"
import { Container } from "@/components/container"
import Markdown from "@/components/markdown"
import { ABOUT_SECTIONS, CONTACT_SECTIONS } from "@/data/web"

const principleIcons = [MessageCircle, CheckCheck, Handshake]
const headingClassName =
  "font-heading text-4xl/tight font-semibold tracking-tight sm:text-5xl/tight md:text-7xl/tight"

export function HowWeWork() {
  return (
    <section
      className="mt-16 border-y bg-secondary/30 py-12 sm:py-16"
      aria-labelledby="how-we-work"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Our approach
            </p>
            <h2 id="how-we-work" className={headingClassName}>
              How We Work
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            We promise responsiveness, consistency, and a focus on long-term
            relationships. Our approach is simple, reliable, and built around
            your day-to-day operations.
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {ABOUT_SECTIONS.howWeWork.map((item, index) => {
            const Icon = principleIcons[index]!
            return (
              <article
                key={item.title}
                className="border-t border-primary/20 pt-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="max-w-xs font-heading text-2xl/tight font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export function Warehouses() {
  return (
    <section className="mt-16" aria-labelledby="warehouses">
      <Container>
        <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Close to your business
            </p>
            <h2 id="warehouses" className={headingClassName}>
              Warehouses
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Our Robertsdale and Lafayette warehouses support morning-focused
            routes along the I-10 corridor and surrounding markets. Connect
            directly with your local team.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {CONTACT_SECTIONS.locations.map((location) => (
            <article
              key={location.name}
              className="overflow-hidden rounded-2xl border bg-background"
            >
              <div className="flex items-start justify-between gap-4 border-b bg-secondary/40 p-6 sm:p-8">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                    {location.name}
                  </p>
                  <h3 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {location.street.split(",")[1]?.trim()}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your local warehouse team
                  </p>
                </div>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-background text-primary">
                  <Warehouse className="size-6" aria-hidden="true" />
                </span>
              </div>
              <div className="space-y-5 p-6 sm:p-8">
                <div className="flex items-start gap-3 text-sm leading-relaxed">
                  <MapPin
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <address className="text-muted-foreground not-italic">
                    {location.street}
                  </address>
                </div>
                {location.phone && (
                  <a
                    href={`tel:${location.phone.trim().replace(/[^+\d]/g, "")}`}
                    className="flex items-center gap-3 text-sm transition hover:text-primary hover:underline"
                  >
                    <Phone
                      className="size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {location.phone.trim()}
                  </a>
                )}
                {location.email && (
                  <a
                    href={`mailto:${location.email}`}
                    className="flex items-start gap-3 text-sm transition hover:text-primary hover:underline"
                  >
                    <Mail
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="break-all">{location.email}</span>
                  </a>
                )}
                <div className="border-t pt-5">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.street)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get directions to the ${location.name} warehouse (opens in a new tab)`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Get directions{" "}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-6 rounded-2xl border bg-secondary/30 p-6 sm:p-8 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:p-10">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Growing together
            </p>
            <h3 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Built to grow
            </h3>
          </div>
          <Markdown
            content={ABOUT_SECTIONS.story}
            className="text-sm leading-relaxed text-muted-foreground sm:text-base [&_li]:marker:text-primary [&_p]:mb-4 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2"
          />
        </div>
      </Container>
    </section>
  )
}
