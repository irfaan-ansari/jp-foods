import { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdown from "@/components/markdown"
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
      {/* page title */}
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold uppercase sm:text-5xl/tight md:text-7xl/tight">
                {content.title}
              </h2>
              <p className="text-lg">{content.description}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* page content */}
      <section className="mt-16">
        <Container>
          <div className="@container grid grid-cols-8 gap-16">
            {/* requirments/additional details - desktop */}
            <div className="col-span-8 lg:order-2 lg:col-span-3">
              <div className="sticky top-24 bg-secondary p-6">
                <Markdown content={content.details} />
              </div>
            </div>
            <div className="col-span-8 lg:col-span-5">
              {/* form */}
              <content.form
                position={content.title}
                location={content.location}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default ApplicationPage
