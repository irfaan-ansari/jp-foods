import type { ReactNode } from "react"
import { emailStyles } from "../../config/email-styles"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email"

type EmailLayoutProps = {
  children: ReactNode
  heading: string
  template?: "customer" | "admin"
  preview?: string
}

export function EmailLayout({
  children,
  heading,
  template = "customer",
  preview,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview ?? `${heading} | Jimenez Produce`}</Preview>
      <Tailwind config={{ ...emailStyles, presets: [pixelBasedPreset] }}>
        <Body className="bg-email-canvas text-email-text m-0 px-4 py-8 font-sans">
          <Container className="border-email-outline mx-auto max-w-[600px] overflow-hidden rounded-xl border bg-white">
            <Section className="bg-email-brand px-8 py-7">
              <Text className="text-email-brand-soft m-0 text-sm font-bold tracking-[2px] uppercase">
                Jimenez Produce
              </Text>
              <Heading
                as="h1"
                className="mt-3 mb-0 text-[28px] leading-[34px] font-semibold text-white"
              >
                {heading}
              </Heading>
            </Section>
            {children}
            <Section className="border-email-border bg-email-footer border-t px-8 py-6">
              <Text className="text-email-muted my-0 text-sm leading-6">
                {template === "admin"
                  ? "Internal notification · Jimenez Produce"
                  : "Jimenez Produce · Foodservice distribution across the Gulf Coast"}
              </Text>
              <Text className="text-email-subtle mt-3 mb-0 text-xs leading-5">
                Questions? Reply to this email or contact{" "}
                <Link
                  href="mailto:info@jimenezproduce.com"
                  className="text-email-brand underline"
                >
                  info@jimenezproduce.com
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
