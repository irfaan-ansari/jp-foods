"use client"

import { Truck, CircleArrowRight, ChevronRight } from "lucide-react"
import { Badge } from "@jp/ui/components/badge"
import { Button } from "@jp/ui/components/button"
import Link from "next/link"
import Image from "next/image"

import { HOME_SECTIONS } from "@/data/web"
import { Container } from "./container"

const { hero, categories } = HOME_SECTIONS
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-secondary via-lime-50 to-background">
      <Container className="mt-36 pb-28">
        <div className="flex flex-col items-center gap-16">
          <Badge
            className="h-8 rounded-full bg-accent pr-3 font-semibold text-[#ddeab4] uppercase"
            variant="outline"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#ddeab4] text-accent">
              <Truck className="size-4" />
            </span>
            {hero.badge}
          </Badge>
          <div className="space-y-8">
            <h1 className="mx-auto flex max-w-xl flex-col items-center text-center font-heading text-5xl/tight font-bold md:text-7xl/tight">
              Foodservice Distribution
              <span className="text-primary">you can rely on</span>
            </h1>

            <p className="mt-6 max-w-xl text-center text-lg font-medium">
              {hero.description}
            </p>
            <p className="mt-6 text-center text-sm italic">{hero.label}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            className="[&>svg]:transition hover:[&>svg]:translate-x-1"
            asChild
          >
            <Link href="/apply">
              Apply for Account
              <CircleArrowRight />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="[&>svg]:transition hover:[&>svg]:translate-x-1"
          >
            View Products
            <CircleArrowRight />
          </Button>
        </div>
      </Container>
    </section>
  )
}
