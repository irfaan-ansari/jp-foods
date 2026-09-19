import React from "react"
import Image from "next/image"
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
      {/* page title*/}
      <section className="relative py-16 text-primary-foreground">
        <div className="absolute inset-0 bg-linear-to-br from-lime-800 to-lime-50">
          <Image
            src="/page-banner.jpg"
            width={1800}
            height={600}
            alt="image"
            className="h-full w-full object-cover"
          />
        </div>
        <Container className="relative">
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-7xl/tight">
                Become a customer
              </h2>
              <p className="text-lg">
                Please complete this secure application to open a new account
                with Jimenez Produce. All information is kept confidential and
                will be reviewed by our team before approval.
              </p>
              <p></p>
            </div>
          </div>
        </Container>
      </section>
      <section className="mt-16">
        <Container className="mb-16 max-w-4xl">
          <CustomerForm />
        </Container>
      </section>
    </LanguageProvider>
  )
}
