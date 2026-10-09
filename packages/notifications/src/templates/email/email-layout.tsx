import type { ReactNode } from "react"
import { env } from "@jp/utils/env"
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
        <Body className="px-3 py-10 m-0 font-sans bg-canvas text-text">
          <Container className="border-outline border-t-brand mx-auto w-full max-w-[600px] overflow-hidden rounded-xl border border-t-4 bg-white">
            <Section className="px-6 pb-6 border-b bg-brand/10 border-border pt-7 sm:px-8">
              <Row>
                <Column className="w-20 align-middle">
                  <Img
                    src={`${env.NEXT_PUBLIC_PUBLIC_URL}/logo.png`}
                    alt="Jimenez Produce"
                    className="w-20 h-auto"
                  />
                </Column>
                <Column className="pl-4 align-middle">
                  <Text className="m-0 text-3xl font-bold tracking-tight text-text">
                    Jimenez Produce
                  </Text>
                  <Text className="m-0 mt-1 text-base font-semibold leading-4 text-muted">
                    Foodservice distribution
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="px-6 pb-6 border-b border-border pt-7 sm:px-8">
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
            <Section className="px-6 py-5 border-t bg-footer border-border sm:px-8">
              <Row style={{ tableLayout: "fixed", width: "100%" }}>
                <Column width="50%" className="pr-3 align-top">
                  <Text className="m-0 mb-2 text-sm font-semibold text-text">
                    Alabama
                  </Text>
                  <Text className="m-0 text-xs leading-5 text-muted">
                    <Link
                      href="tel:+12512622607"
                      className="no-underline text-muted"
                    >
                      +1 (251) 262-2607
                    </Link>
                  </Text>
                  <Text className="m-0 text-xs leading-5">
                    <Link
                      href="mailto:jorge@jimenezproduce.com"
                      className="no-underline text-muted"
                      style={{
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      jorge@jimenezproduce.com
                    </Link>
                  </Text>
                  <Text className="m-0 mt-1 text-xs leading-5 text-muted">
                    23141 Rubens Ln
                    <br />
                    Robertsdale, AL 36567
                  </Text>
                </Column>
                <Column width="50%" className="pl-3 align-top">
                  <Text className="m-0 mb-2 text-sm font-semibold text-text">
                    Louisiana
                  </Text>
                  <Text className="m-0 text-xs leading-5 text-muted">
                    <Link
                      href="tel:+13378069008"
                      className="no-underline text-muted"
                    >
                      +1 (337) 806-9008
                    </Link>
                  </Text>
                  <Text className="m-0 text-xs leading-5">
                    <Link
                      href="mailto:yhessenia@jimenezproduce.com"
                      className="no-underline text-muted"
                      style={{
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      yhessenia@jimenezproduce.com
                    </Link>
                  </Text>
                  <Text className="m-0 mt-1 text-xs leading-5 text-muted">
                    100 Goldenrod Dr
                    <br />
                    Lafayette, LA 70507
                  </Text>
                </Column>
              </Row>
              <Text className="mt-6 mb-0 text-xs leading-5 text-subtle">
                © {new Date().getFullYear()} Jimenez Produce · All rights
                reserved
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
