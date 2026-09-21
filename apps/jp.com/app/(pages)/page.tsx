import { HOME_SECTIONS } from "@/data/web"
import React from "react"
import Image from "next/image"
import { Container } from "@/components/container"
import { Button } from "@jp/ui/components/button"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@jp/ui/components/card"
import { Marquee } from "@jp/ui/components/marquee"
import { ArrowRight, CircleCheck } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@jp/ui/components/carousel"
import { GettingStartedList } from "@/components/getting-started-progress"
import { CTA } from "@/components/cta"
const { hero, serve, steps, chooseUs, marquee, categories } = HOME_SECTIONS

const HomePage = () => {
  return (
    <React.Fragment>
      {/* hero */}
      <section>
        <div className="grid grid-cols-1 items-center overflow-hidden">
          {/* image */}
          <div className="col-start-1 row-start-1 size-full">
            <Image
              width={1800}
              height={900}
              src={hero.image}
              alt="Hero banner"
              priority
              className="h-[80svh] w-full object-cover object-center lg:h-225"
            />
          </div>
          {/* content */}
          <div className="col-start-1 row-start-1 size-full bg-linear-to-tr from-black">
            <Container className="h-full">
              <div className="relative max-w-3xl py-32">
                {/* <span className="absolute -inset-40 bg-black/40 mask-y-from-90% mask-x-from-90% backdrop-blur-xs"></span> */}
                <div className="relative flex flex-col items-start gap-8 text-primary-foreground">
                  <h1 className="font-heading text-5xl/tight font-bold md:text-8xl/tight">
                    {hero.title}
                  </h1>
                  <h2 className="max-w-lg text-xl font-medium">
                    {hero.description}
                  </h2>
                  <p className="text-base italic">{hero.badge}</p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      asChild
                      variant="outline"
                      size="xl"
                      className="text-foreground"
                    >
                      <Link href="/products">
                        View Products <ArrowRight />{" "}
                      </Link>
                    </Button>
                    <Button asChild size="xl">
                      <Link href="/apply">
                        Apply for an Account <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* who we serve */}
      <section className="mt-16">
        <Container>
          <div className="space-y-8">
            <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
              Who We Serve
            </h2>
            <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {serve.map((item, i) => (
                <Card key={item.title}>
                  <CardHeader>
                    <span className="inline-flex items-center justify-start rounded-lg">
                      <item.icon className="size-16 text-primary" />
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-10">
                    <h4 className="font-heading text-3xl font-semibold">
                      {item.title}
                    </h4>
                    <p className="text-base">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* suppliers marquee */}
      <section className="mt-16">
        <Container className="relative overflow-hidden">
          <Marquee className="gap-8">
            <div className="flex items-center gap-8">
              {marquee.map((img, i) => (
                <div className="rounded-xl bg-secondary p-4" key={img + i}>
                  <Image
                    src={img}
                    alt={img}
                    width={200}
                    height={200}
                    className="size-24 mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 -left-4 w-24 bg-linear-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 -right-4 w-24 bg-linear-to-l from-background"></div>
        </Container>
      </section>

      {/* categories */}
      <section className="mt-16">
        <Container>
          <div className="space-y-8">
            <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
              Featured Categories
            </h2>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-8">
                {categories.map((cat, i) => (
                  <CarouselItem
                    key={i}
                    className="basis-2/3 pl-8 md:basis-1/3 lg:basis-1/4"
                  >
                    <Link
                      href={`/products?cat=${encodeURIComponent(cat.title)}`}
                      className="block pb-0.5 pl-0.5 hover:[&_img]:scale-110"
                    >
                      <div className="relative overflow-hidden rounded-[0.5rem] bg-linear-to-br from-secondary via-background to-secondary shadow-sm">
                        <div className="overflow-hidden">
                          <Image
                            width={600}
                            height={900}
                            src={cat.image}
                            alt={cat.image}
                            className="relative z-2 aspect-square w-full rounded-t-[0.5rem] object-cover backdrop-blur-3xl transition ease-out"
                          />
                        </div>
                        <div className="px-3 py-6">
                          <h4 className="text-lg font-semibold">{cat.title}</h4>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-3" />
              <CarouselNext className="-right-3" />
            </Carousel>
            <div className="sm:text-right">
              <Button
                asChild
                size="xl"
                className="w-full justify-start sm:w-auto"
              >
                <Link href="/products">
                  View Catalog
                  <ArrowRight className="ml-auto" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* getting started */}
      <section className="mt-16 bg-secondary py-16">
        <Container>
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
                Getting Started with <br />
                <span className="text-primary">Jimenez Produce</span>
              </h2>
              <p className="max-w-3xl text-base/normal opacity-80">
                We make it easy for foodservice operations to start working with
                Jimenez Produce. Our onboarding process is designed to be clear,
                efficient, and focused on getting your account set up quickly.
              </p>
            </div>

            <GettingStartedList steps={steps} />
          </div>
        </Container>
      </section>

      {/* why choose us */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="max-w-2xl space-y-8">
              <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
                Why Choose Us
              </h2>
              <div className="flex flex-col gap-6">
                {chooseUs.map((item) => (
                  <div className="flex items-start gap-4" key={item.title}>
                    <div className="shrink-0 pt-1">
                      <CircleCheck className="size-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-3xl font-semibold">
                        {item.title}
                      </h4>
                      <p className="text-lg font-medium text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[1/0.8] bg-secondary">
              <Image
                width={600}
                height={600}
                src="/why-choose-us.jpeg"
                alt="Event cover"
                className="aspect-[1/0.8] h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* fast delivery area */}
      <section className="mt-16">
        <div className="grid grid-cols-1">
          <div className="col-start-1 row-start-1 overflow-hidden rounded-lg">
            <Image
              src="/reliable-delivery.jpeg"
              width={1600}
              height={600}
              alt="Truck image"
              className="h-172 w-full object-cover object-right md:h-152"
            />
          </div>

          <div className="relative col-start-1 row-start-1 flex h-full flex-col justify-center">
            <span className="absolute inset-0 z-0 bg-linear-to-r from-black/30 via-black/60 to-black/40"></span>
            <div className="mx-auto max-w-4xl px-6 py-20 text-center">
              <h2 className="relative flex-1 font-heading text-4xl/tight font-bold text-primary-foreground sm:text-5xl/tight md:text-7xl/tight">
                Fast & Reliable Delivery
              </h2>
              <p className="relative mt-4 text-lg font-medium text-white">
                We take pride in delivering our products with our own fleet of
                trucks, operated exclusively by professional drivers. This
                ensures the highest level of care, reliability, and efficiency
                in every delivery. With our dedicated team and well-maintained
                vehicles, we guarantee that your orders arrive on time, every
                time. Trust us for seamless, punctual, and professional service
                from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* coverage area */}

      {/* safetty and quality */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="max-w-3xl">
              <div className="sticky top-28 space-y-4">
                <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
                  Food Safety & <span className="text-primary">Quality</span>
                </h2>
                <p className="text-muted-foreground">
                  We take food safety seriously. From receiving to delivery, our
                  trained team handles every step with care, cleanliness, and
                  consistency. You can count on us for safe, reliable
                  distribution that helps your operation run smoothly and
                  confidently.
                </p>
              </div>
            </div>
            <div className="-m-2 no-scrollbar flex snap-x snap-mandatory flex-row flex-nowrap gap-8 overflow-x-scroll p-2 lg:snap-none lg:flex-col">
              {HOME_SECTIONS.quality.map((item, i) => (
                <Card
                  key={i}
                  className="shrink-0 basis-3/4 snap-start bg-secondary/60 py-10 shadow-sm ring-0 lg:basis-auto"
                >
                  <CardHeader className="px-10">
                    <h4 className="font-heading text-3xl font-semibold">
                      {item.title}
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4 px-10">
                    {item.items.map((text, i) => (
                      <div className="flex items-center gap-4" key={i}>
                        <CircleCheck className="size-6 shrink-0 text-primary" />
                        <p className="text-lg font-medium opacity-80">{text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* cta */}
      <CTA />
    </React.Fragment>
  )
}
export default HomePage
