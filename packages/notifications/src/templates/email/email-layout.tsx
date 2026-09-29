import type { ReactNode } from "react"
import { emailStyles } from "../../config/email-styles"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
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
      <Preview>{preview ?? `${heading} | Jimenez Produce`}</Preview>
      <Tailwind config={{ ...emailStyles, presets: [pixelBasedPreset] }}>
        <Head />
        <Body className="bg-canvas text-text m-0 px-3 py-10 font-sans">
          <Container className="border-outline border-t-brand mx-auto w-full max-w-[600px] overflow-hidden rounded-xl border border-t-4 bg-white">
            <Section className="border-b border-border px-6 pt-7 pb-6 sm:px-8">
              <Row>
                <Column className="w-12 align-middle">
                  <Img
                    src="https://jimenezproduce.com/logo.png"
                    alt="Jimenez Produce"
                    className="h-auto w-18"
                  />
                </Column>
                <Column className="pl-4 align-middle">
                  <Text className="text-text m-0 text-2xl font-bold tracking-tight">
                    Jimenez Produce
                  </Text>
                  <Text className="m-0 mt-1 text-base leading-4 text-muted">
                    Foodservice distribution
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border-b border-border px-6 pt-7 pb-6 sm:px-8">
              {template === "admin" && (
                <Text className="text-brand mt-0 mb-2 text-[10px] font-bold tracking-[1.5px] uppercase">
                  Internal notification
                </Text>
              )}
              <Heading
                as="h1"
                className="text-text m-0 text-[26px] leading-[34px] font-bold tracking-[-0.6px]"
              >
                {heading}
              </Heading>
            </Section>
            {children}
            <Section className="bg-footer border-t border-border px-6 py-5 sm:px-8">
              <Text className="my-0 text-xs leading-5 text-muted">
                {template === "admin"
                  ? "Internal notification · Jimenez Produce"
                  : "Jimenez Produce · Foodservice distribution across the Gulf Coast"}
              </Text>
              <Text className="text-subtle mt-2 mb-0 text-xs leading-5">
                Questions? Reply to this email or contact{" "}
                <Link
                  href="mailto:info@jimenezproduce.com"
                  className="text-brand underline"
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
