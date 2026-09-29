import React from "react"
import { Metadata } from "next"
import { Container } from "@/components/container"
import { LanguageProvider } from "@/components/language-selector"
import { CustomerForm } from "@/features/apply/forms/customer-form"

export const metadata: Metadata = {
  title: "Apply for an account",
  description:
    "Apply for a foodservice distribution account and get reliable delivery of fresh produce and supplies for your restaurant or kitchen.",
}

export default function ApplyPage() {
  return (
    <LanguageProvider defaultLanguage="en">
      <section className="bg-secondary py-12 sm:py-16">
        <Container className="max-w-4xl">
          <div className="flex h-full flex-col items-center text-center">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Jimenez Produce · Customer application
            </p>
            <h1 className="flex-1 font-heading text-4xl/tight font-semibold text-primary sm:text-5xl/tight md:text-7xl/tight">
              Fresh starts here.
            </h1>

            <p className="mt-5 max-w-2xl text-base/7 text-muted-foreground sm:text-lg/8">
              Bring fresh produce and reliable service to your business.
              Complete your application below to open an account with Jimenez
              Produce.
            </p>
          </div>
        </Container>
      </section>
      <section className="bg-secondary/25 py-8 sm:py-12">
        <Container className="max-w-7xl">
          <CustomerForm />
        </Container>
      </section>
    </LanguageProvider>
  )
}
