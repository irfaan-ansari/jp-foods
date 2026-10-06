import type { Metadata } from "next"
import { Container } from "@/components/container"
import { TrackingForm } from "@/features/tracking/components/tracking-form"

export const metadata: Metadata = {
  title: "Track application",
  description:
    "Check the status of a Jimenez Produce customer or job application.",
}

const TrackApplicationPage = () => {
  return (
    <>
      <section className="border-b bg-secondary/40">
        <Container className="max-w-5xl py-12 text-center sm:py-16">
          <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Application tracking
          </p>
          <h1 className="font-heading text-4xl/tight font-semibold sm:text-5xl/tight">
            Check your application status.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base/7 text-muted-foreground sm:text-lg/8">
            Use one form to track a customer application or a job application.
            Enter the application number and the email used when applying.
          </p>
        </Container>
      </section>

      <section className="bg-secondary/20 py-10 sm:py-14">
        <Container className="max-w-5xl">
          <TrackingForm />
        </Container>
      </section>
    </>
  )
}

export default TrackApplicationPage
