import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowDown, MapPin } from "lucide-react"
import Markdown from "@/components/markdown"
import { Button } from "@jp/ui/components/button"
import { notFound } from "next/navigation"
import { Container } from "@/components/container"
import { OPEN_POSITIONS } from "@/features/careers/careers.positions"

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ position: string }>
}): Promise<Metadata> => {
  const { position } = await params

  const content = OPEN_POSITIONS.find((pos) => pos.href === position)

  if (!content) return {}

  return {
    title: content.title,
    description: content.description,
  }
}

const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ position: string }>
}) => {
  const { position } = await params

  const content = OPEN_POSITIONS.find((pos) => pos.href === position)

  if (!content) notFound()

  return (
    <>
      <section className="border-b bg-secondary/40">
        <Container className="max-w-7xl py-10 sm:py-14">
          <Link
            href="/careers#open-positions"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="size-4" /> All opportunities
          </Link>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                {content.department} / Jimenez Produce
              </p>
              <h1 className="font-heading text-3xl/tight font-semibold tracking-tight sm:text-4xl/tight lg:text-5xl/tight">
                {content.title}
              </h1>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {content.location || "Select your location when applying"}
              </p>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                {content.description}
              </p>
            </div>
            <Button asChild size="xl" className="self-start lg:self-auto">
              <a href="#application">
                Start your application <ArrowDown />
              </a>
            </Button>
          </div>
          <details className="mt-8 rounded-2xl border bg-background p-5 sm:p-6">
            <summary className="cursor-pointer font-semibold marker:text-primary">
              About this role / Responsibilities & qualifications
            </summary>
            <Markdown
              content={content.details}
              className="mt-6 max-w-3xl text-sm leading-relaxed [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-semibold [&_li]:mb-2 [&_ul]:list-disc"
            />
          </details>
        </Container>
      </section>
      <section
        id="application"
        className="scroll-mt-32 bg-secondary/15 py-10 sm:py-14"
      >
        <Container className="max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Take the next step
              </p>
              <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
                Apply for this role
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Applying for{" "}
              <span className="font-medium text-foreground">
                {content.title}
              </span>
            </p>
          </div>
          <content.form position={content.title} location={content.location} />
        </Container>
      </section>
    </>
  )
}

export default ApplicationPage
