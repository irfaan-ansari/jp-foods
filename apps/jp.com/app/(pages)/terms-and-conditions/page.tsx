import { Container } from "@/components/container"
import Markdown from "@/components/markdown"
import { POLICIES } from "@/data/policy"
import React from "react"

const TermsPage = () => {
  return (
    <React.Fragment>
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold uppercase sm:text-5xl/tight md:text-7xl/tight">
                Terms and Conditions
              </h2>
              <p className="font-medium">Last Updated: June 24, 2026</p>
            </div>
          </div>
        </Container>
      </section>

      {/*  */}
      <section className="my-16">
        <Container className="max-w-3xl">
          <Markdown content={POLICIES.terms} />
        </Container>
      </section>
    </React.Fragment>
  )
}

export default TermsPage
