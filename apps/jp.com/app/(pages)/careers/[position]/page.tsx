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
      <section className="bg-lime-100 py-16">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-4xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-7xl/tight">
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
          <div className="mx-auto max-w-4xl rounded-3xl border p-6 lg:p-10">
            {/* requirments/additional details - desktop */}
            {/* <div className="col-span-8 lg:order-2 lg:col-span-3">
              <div className="sticky p-6 top-24 bg-secondary">
                <Markdown content={content.details} />
              </div>
            </div> */}

            {/* form */}
            <content.form
              position={content.title}
              location={content.location}
            />
          </div>
        </Container>
      </section>
    </>
  )
}

export default ApplicationPage
