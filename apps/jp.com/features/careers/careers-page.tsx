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
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore career opportunities in foodservice distribution. Join our team serving restaurants and commercial kitchens across the Gulf Coast.",
}

const CareersPage = () => {
  return (
    <>
      {/* page title*/}
      <section className="bg-highlight py-16 text-primary-foreground">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold uppercase sm:text-5xl/tight md:text-7xl/tight">
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
        <Container className="max-w-4xl">
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
                      <CardTitle className="mb-4 font-heading text-3xl font-semibold uppercase">
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
                    <div className="shrink-0">
                      <Button size="xl" className="w-full min-w-40 md:w-auto">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}

export default CareersPage
