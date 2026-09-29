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
                <Column className="w-20 align-middle">
                  <Img
                    src="https://jimenezproduce.com/logo.png"
                    alt="Jimenez Produce"
                    className="h-auto w-20"
                  />
                </Column>
                <Column className="pl-4 align-middle">
                  <Text className="text-text m-0 text-3xl font-bold tracking-tight">
                    Jimenez Produce
                  </Text>
                  <Text className="m-0 mt-1 text-base leading-4 font-semibold text-muted">
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
              <Row style={{ tableLayout: "fixed", width: "100%" }}>
                <Column width="50%" className="pr-3 align-top">
                  <Text className="text-text m-0 mb-2 text-sm font-semibold">
                    Alabama
                  </Text>
                  <Text className="m-0 text-xs leading-5 text-muted">
                    <Link
                      href="tel:+12512622607"
                      className="text-muted no-underline"
                    >
                      +1 (251) 262-2607
                    </Link>
                  </Text>
                  <Text className="m-0 text-xs leading-5">
                    <Link
                      href="mailto:jorge@jimenezproduce.com"
                      className="text-muted no-underline"
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
                  <Text className="text-text m-0 mb-2 text-sm font-semibold">
                    Louisiana
                  </Text>
                  <Text className="m-0 text-xs leading-5 text-muted">
                    <Link
                      href="tel:+13378069008"
                      className="text-muted no-underline"
                    >
                      +1 (337) 806-9008
                    </Link>
                  </Text>
                  <Text className="m-0 text-xs leading-5">
                    <Link
                      href="mailto:yhessenia@jimenezproduce.com"
                      className="text-muted no-underline"
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
              <Text className="text-subtle mt-6 mb-0 text-xs leading-5">
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
