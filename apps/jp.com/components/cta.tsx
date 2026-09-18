import Link from "next/link"
import { Button } from "@jp/ui/components/button"
import { Container } from "@/components/container"
import { cn } from "@jp/ui/lib/utils"

export const CTA = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "mt-16 bg-linear-to-b from-lime-200 via-lime-100 to-background py-16",
        className
      )}
    >
      <Container>
        <div className="space-y-8">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="flex-1 font-heading text-4xl/tight font-semibold sm:text-5xl/tight md:text-6xl/tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl">
              If you operate a restaurant, food truck, or commercial kitchen,
              apply for a Jiménez Produce account to get started with a reliable
              foodservice distributor.
            </p>
          </div>
          <div className="text-center">
            <Button
              asChild
              size="xl"
              className="bg-foreground hover:bg-foreground/80"
            >
              <Link href="/apply">Apply for an Account</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
