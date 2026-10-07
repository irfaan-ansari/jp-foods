import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowDown, ArrowUpRight, Check, MapPin } from "lucide-react"
import { OPEN_POSITIONS } from "@/features/careers/careers.positions"
import { Button } from "@jp/ui/components/button"
import { Container } from "@/components/container"

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities in foodservice distribution. Join our team serving restaurants and commercial kitchens across the Gulf Coast.",
}

const CareersPage = () => (
  <>
    <section className="overflow-hidden border-b bg-secondary/40">
      <Container className="max-w-7xl py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <span className="size-2 rounded-full bg-primary" /> Careers at
              Jimenez Produce
            </p>
            <h1 className="max-w-2xl font-heading text-4xl/tight font-semibold tracking-tight sm:text-5xl/tight lg:text-6xl/tight">
              Good food.
              <br />
              Great people.
              <br />
              <span className="text-primary">Room to grow.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Help us keep the Gulf Coast's kitchens moving. Bring your skills
              to a team that cares about quality, dependable service, and the
              people behind every delivery.
            </p>
            <Button asChild size="xl" className="mt-8">
              <a href="#open-positions">
                Explore open roles <ArrowDown />
              </a>
            </Button>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" /> Serving Alabama & Louisiana
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-primary/10">
              <Image
                src="/truck-wrap.jpg"
                alt="Jimenez Produce delivery truck"
                width={900}
                height={800}
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
            <div className="relative mx-5 -mt-12 rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                A team with a purpose
              </p>
              <p className="mt-2 font-heading text-xl font-semibold">
                From our warehouse to their kitchen.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Every role helps local restaurants get what they need, when they
                need it.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section id="open-positions" className="scroll-mt-32 py-14 sm:py-20">
      <Container className="max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Find your next chapter
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Open opportunities
            </h2>
            <p className="mt-3 text-muted-foreground">
              Different skills. One team. Find the role that fits you.
            </p>
          </div>
          <span className="rounded-full border px-4 py-2 text-sm text-muted-foreground">
            {OPEN_POSITIONS.length} open roles
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {OPEN_POSITIONS.map((position) => (
            <Link
              key={position.href}
              href={`/careers/${position.href}`}
              className="group flex flex-col rounded-2xl border bg-background p-6 transition hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {position.department}
                </span>
                <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight group-hover:text-primary">
                {position.title}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                {position.location || "Select your location when applying"}
              </p>
              <p className="mt-5 leading-relaxed">{position.description}</p>
              <div className="mt-auto pt-6">
                {position.tags.map((tag) => (
                  <p
                    key={tag}
                    className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="size-3.5 text-primary" />
                    {tag}
                  </p>
                ))}
                <div className="flex items-center justify-between border-t pt-4 text-sm">
                  <span className="font-semibold text-primary">
                    View role & apply
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {position.department}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  </>
)

export default CareersPage
