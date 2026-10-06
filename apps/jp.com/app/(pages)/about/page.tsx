import React from "react"
import {
  HowWeWork,
  Warehouses,
} from "@/features/about/components/about-sections"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { COVERAGE_LOCATIONS } from "@/data/web"
import { CTA } from "@/components/cta"
import { Container } from "@/components/container"
import { Marquee } from "@jp/ui/components/marquee"
import { Card, CardContent, CardTitle } from "@jp/ui/components/card"
import { OrbitingCircles } from "@jp/ui/components/orbiting-circles"
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
} from "@jp/ui/components/map"
import { AnimatedCircularProgressBar } from "@jp/ui/components/animated-circular-progress-bar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our commitment to reliable foodservice distribution, fresh produce sourcing, and dependable delivery for Gulf Coast restaurants.",
}

const uniqueCodes = [
  ...new Set(COVERAGE_LOCATIONS.map((item) => item.label.slice(-2))),
]

const AboutPage = () => {
  return (
    <React.Fragment>
      <section className="bg-secondary py-16">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold text-primary sm:text-5xl/tight md:text-7xl/tight">
                About us
              </h2>
              <p className="text-lg">
                We are a produce and foodservice distributor built on
                reliability and quality. As your trusted partner, we deliver
                consistent products and dependable service you can count on.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* who are we */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <div className="max-w-lg space-y-4">
                <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-7xl/tight">
                  Who Are We
                </h2>
                <p className="text-muted-foregorund">
                  We are a team of professionals committed to supporting the
                  success of our customers. Our people understand the demands of
                  the foodservice industry and take pride in doing things the
                  right way—every time. Through disciplined processes, hands-on
                  service, and a partnership mindset, we help our customers
                  operate confidently and efficiently.
                  <br />
                  <br />
                  With experienced leadership and a dedicated team, we operate
                  with a strong focus on food safety, quality control, and
                  operational efficiency. From our warehouse to your kitchen, we
                  maintain high standards to ensure product integrity at every
                  step.
                </p>
              </div>
            </div>
            <div className="aspect-[1/0.8] bg-secondary">
              <Image
                src="/truck-wrap.jpg"
                alt="What we do"
                width={900}
                height={900}
                className="aspect-[1/0.8] h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* what we do */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="bg-background">
              <Image
                src="/hero-2.png"
                alt="What we do"
                width={900}
                height={900}
                className="aspect-[1/0.8] h-auto w-full rounded-2xl object-cover"
              />
            </div>
            <div className="space-y-8">
              <div className="max-w-lg space-y-4">
                <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-7xl/tight">
                  What We Do
                </h2>
                <p className="text-muted-foregorund">
                  We focus on dependable service, consistent product quality,
                  and professional operations designed to meet the demands of
                  foodservice environments. <br /> <br />
                  We operate like a service partner, not just another truck.
                  That means route planning around your prep time, consistent
                  quality checks, bilingual support, and a team that actually
                  picks up the phone when you need help.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <Card className="shadow-sm">
                  <div className="space-y-6 px-6">
                    <div className="aspect-aquare flex h-56 items-center justify-center">
                      <AnimatedCircularProgressBar
                        min={0}
                        max={200}
                        value={150}
                        gaugePrimaryColor="#80b83a"
                        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
                      />
                    </div>
                    <CardTitle className="text-center font-heading text-xl font-semibold">
                      Active Customers
                    </CardTitle>
                  </div>
                </Card>
                <Card className="shadow-sm">
                  <div className="space-y-6 px-6">
                    <CardContent className="relative mt-auto flex h-56 w-full flex-col items-center justify-center overflow-hidden text-primary-foreground">
                      <OrbitingCircles radius={80} path={true} iconSize={20}>
                        {uniqueCodes.map((code) => (
                          <span
                            key={code}
                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-medium"
                          >
                            {code}
                          </span>
                        ))}
                      </OrbitingCircles>
                      <OrbitingCircles radius={40} reverse speed={2}>
                        {uniqueCodes.map((code) => (
                          <span
                            key={code}
                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading font-medium"
                          >
                            {code}
                          </span>
                        ))}
                      </OrbitingCircles>
                    </CardContent>
                    <CardTitle className="text-center font-heading text-xl font-semibold">
                      Coverage Areas
                    </CardTitle>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* coverage area */}
      <section className="mt-16 overflow-hidden">
        <Container>
          <div className="space-y-4">
            <h2 className="min-w-xs shrink-0 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-7xl/tight">
              coverage area
            </h2>
            <div className="flex-wrap space-y-0 overflow-hidden">
              <Marquee pauseOnHover className="[--duration:80s]">
                {COVERAGE_LOCATIONS.map((area, i) => (
                  <span
                    key={i}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-secondary px-3"
                  >
                    <MapPin className="size-4" />
                    {area.label}
                  </span>
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:80s]">
                {COVERAGE_LOCATIONS.map((area, i) => (
                  <span
                    key={i}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-secondary px-3"
                  >
                    {area.label}
                  </span>
                ))}
              </Marquee>
            </div>
          </div>
        </Container>
      </section>
      <section>
        <div className="mt-8 h-100">
          <Map zoom={5} center={[-89.0174859, 31.282803]} theme="light">
            {COVERAGE_LOCATIONS.map((area) => (
              <MapMarker
                key={area.label}
                longitude={area.lng}
                latitude={area.lat}
              >
                <MarkerContent>
                  <div className="relative inline-flex size-7 items-center justify-center rounded-full bg-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4 text-primary-foreground opacity-80"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
                    </svg>
                  </div>
                </MarkerContent>

                <MarkerTooltip className="rounded-[1rem] bg-background text-foreground">
                  <div className="p-1">{area.label}</div>
                </MarkerTooltip>
              </MapMarker>
            ))}
          </Map>
        </div>
      </section>
      <HowWeWork />
      <Warehouses />

      {/* cta */}
      <CTA />
    </React.Fragment>
  )
}

export default AboutPage
