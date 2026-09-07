import { cn } from "@jp/ui/lib/utils"
import { Container } from "./container"
import { Button } from "@jp/ui/components/button"
import { Particles } from "@jp/ui/components/particles"

import Link from "next/link"
import { CircleArrowRight } from "lucide-react"

export const CTA = ({ className }: { className?: string }) => {
  return (
    <section className={cn("relative mt-16 bg-accent py-16", className)}>
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#FFF"
        refresh
      />
      <Container>
        <div className="space-y-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="flex-1 font-heading text-4xl/tight font-semibold text-primary-foreground sm:text-5xl/tight md:text-6xl/tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground">
              If you operate a restaurant, food truck, or commercial kitchen,
              apply for a Jimenez Produce account to get started with a reliable
              foodservice distributor.
            </p>
          </div>
          <div className="text-center">
            <Button
              asChild
              size="xl"
              variant="secondary"
              className="bg-[#ddeab4] hover:bg-[#ddeab4]/90"
            >
              <Link href="/apply">
                Apply For Account
                <CircleArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
