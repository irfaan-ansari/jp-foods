import { Container } from "@/components/container"
import { CONTACT_SECTIONS } from "@/data/web"
import { ContactForm } from "@/features/contact/forms/contact-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@jp/ui/components/accordion"
import { Button } from "@jp/ui/components/button"
import { Card, CardContent, CardHeader } from "@jp/ui/components/card"
import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  Map,
} from "@jp/ui/components/map"
import { AtSign, MapPinned, Phone, Plus } from "lucide-react"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with our team for reliable foodservice delivery, product inquiries, or account support across the Gulf Coast.",
}

const ContactPage = () => {
  return (
    <React.Fragment>
      {/* page title*/}
      <section className="bg-secondary py-16">
        <Container>
          <div className="flex h-full flex-col items-center">
            <div className="mx-auto max-w-xl space-y-6 text-center">
              <h2 className="flex-1 font-heading text-4xl/tight font-semibold text-primary sm:text-5xl/tight md:text-7xl/tight">
                Contact us
              </h2>
              <p className="text-lg">
                Looking for a reliable distribution partner? <br />
                Get in touch with our team to learn how we can support your
                business.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* contact cards */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CONTACT_SECTIONS.contacts.map((contact, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-start text-neutral-200">
                    <contact.icon className="size-12" />
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col pt-6 text-base md:pt-10">
                  <h5 className="mb-4 font-heading text-3xl font-semibold">
                    {contact.label}
                  </h5>
                  <a
                    href={`tel:${contact.phone}`}
                    className="mb-1 transition ease-out hover:underline"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mb-4 transition ease-out hover:underline"
                  >
                    {contact.email}
                  </a>
                  <p className="text-muted-foreground">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* contact form */}
      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions about our products,
                  deliveries, and warehouse operations.
                </p>
              </div>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                {CONTACT_SECTIONS.faqs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger
                      data-slot="accordion-trigger"
                      className="flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-base font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='plus-'])]:hidden [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0"
                    >
                      {item.title}
                      <Plus className="plus-icon pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    </AccordionTrigger>

                    <AccordionContent className="text-muted-foreground">
                      {item.content}
                      {item.cta && (
                        <div className="mt-4">
                          <Button className="px-4" asChild variant="default">
                            <a
                              href="https://order.jimenezproduce.com"
                              target="_blank"
                              className="no-underline! hover:text-primary-foreground!"
                            >
                              Place Your Order
                            </a>
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div
              className="space-y-8 rounded-2xl bg-secondary p-6 lg:p-8"
              id="contact-form"
            >
              <div className="space-y-4">
                <h2 className="font-heading text-4xl font-semibold lg:text-5xl">
                  Request catalog
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form to receive our latest product catalog and
                  connect with our team to find the right solutions for your
                  operation.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-16">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <div className="max-w-lg">
              <div className="sticky top-28 space-y-6">
                <h2 className="flex-1 font-heading text-4xl/tight font-bold sm:text-5xl/tight md:text-7xl/tight">
                  Warehouses
                </h2>
                <p className="text-base/normal opacity-80">
                  Our Robertsdale and Lafayette warehouses allow us to structure
                  AM-focused routes along the I-10 corridor and surrounding
                  markets.
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-8">
              {CONTACT_SECTIONS.locations.map((loc) => (
                <div
                  className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm"
                  key={loc.name}
                >
                  <h5 className="font-heading text-2xl font-semibold">
                    {loc.name}
                  </h5>
                  <div className="space-y-2">
                    {loc.phone && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-invert text-invert-foreground shadow-sm">
                          <Phone className="size-4" />
                        </span>
                        <a
                          href={`tel:${loc.phone}`}
                          className="text-muted-foreground transition ease-out hover:text-foreground hover:underline"
                        >
                          {loc.phone}
                        </a>
                      </div>
                    )}
                    {loc.email && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-invert text-invert-foreground shadow-sm">
                          <AtSign className="size-4" />
                        </span>
                        <a
                          href={`mailto:${loc.email}`}
                          className="text-muted-foreground transition ease-out hover:text-foreground hover:underline"
                        >
                          {loc.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-8 items-center justify-center rounded-full bg-invert text-invert-foreground shadow-sm">
                        <MapPinned className="size-4" />
                      </span>
                      <p className="text-muted-foreground">{loc.street}</p>
                    </div>
                  </div>
                  <div className="mt-10 space-y-8">
                    <div className="space-y-2">
                      <h4 className="font-heading text-lg font-semibold">
                        Office Hours
                      </h4>
                      <p className="opacity-80">
                        Monday to Saturday,
                        <span className="ml-2 font-medium opacity-100">
                          9:00 AM – 5:00 PM
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading text-lg font-semibold">
                        Receiving Hours
                      </h4>
                      <p className="opacity-80">
                        <span className="mr-2 font-medium opacity-100">
                          8:00 AM – 4:00 PM,
                        </span>
                        by appointment only
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      {/* map */}
      <section className="mt-16 h-[500px] w-full">
        <Map zoom={4} center={[-90.0174859, 30.282803]} theme="light">
          {CONTACT_SECTIONS.locations.map((location) => (
            <MapMarker
              key={location.name}
              longitude={location.lng}
              latitude={location.lat}
            >
              <MarkerContent>
                <div className="relative inline-flex size-7 items-center justify-center rounded-full bg-primary">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/40 duration-1000"></span>
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
                <div className="p-1">{location.name}</div>
              </MarkerTooltip>
            </MapMarker>
          ))}
        </Map>
      </section>
    </React.Fragment>
  )
}

export default ContactPage
