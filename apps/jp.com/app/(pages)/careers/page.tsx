import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@jp/ui/components/card"
import { OPEN_POSITIONS } from "@/features/careers/careers.positions"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import { Container } from "@/components/container"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities in foodservice distribution. Join our team serving restaurants and commercial kitchens across the Gulf Coast.",
}

const CareersPage = () => {
  return (
    <React.Fragment>
      {/* page title*/}
      <section className="bg-secondary py-16">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold text-primary sm:text-5xl/tight md:text-7xl/tight">
                Careers
              </h2>
              <p className="text-lg">
                We believe great produce starts with great people. Join a
                dependable, fast-growing team committed to quality, safety, and
                service.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* open positions */}
      <section className="my-16">
        <Container className="max-w-6xl">
          <div className="flex flex-col gap-8">
            {OPEN_POSITIONS.map((position) => (
              <Link
                href={`/careers/${position.href}`}
                key={position.href}
                className="flex"
              >
                <Card>
                  <CardContent className="flex flex-col gap-8 md:flex-row">
                    <div className="flex-1">
                      <CardTitle className="mb-4 font-heading text-3xl font-semibold">
                        {position.title}
                      </CardTitle>
                      <div className="mb-6 flex items-center gap-4">
                        {position.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="h-6 text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {position.location && (
                          <Badge variant="secondary" className="h-6 text-sm">
                            {position.location}
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="text-base">
                        {position.description}
                      </CardDescription>
                    </div>
                    <div className="shrink-0 self-end">
                      <Button
                        size="xl"
                        className="w-full min-w-40 justify-between md:w-auto"
                      >
                        Apply
                        <ArrowRight />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CareersPage
