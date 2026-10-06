import Link from "next/link"
import {
  ArrowRight,
  Headphones,
  Mail,
  Package,
  ReceiptText,
  Settings,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@jp/ui/components/accordion"
import { Button } from "@jp/ui/components/button"
import { SUPPORT_FAQS, SUPPORT_TOPICS } from "../support.const"
import { SupportContact } from "./support-contact"

const topicIcons = { orders: Package, invoices: ReceiptText, account: Settings }

export function SupportContent() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <SupportContact />
      <section aria-labelledby="support-topics">
        <div className="mb-5">
          <h2
            id="support-topics"
            className="text-xl font-semibold tracking-tight"
          >
            How can we help?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Find what you need or get back to managing your account.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SUPPORT_TOPICS.map((topic) => {
            const Icon = topicIcons[topic.icon]
            return (
              <article
                key={topic.title}
                className="flex flex-col rounded-2xl border p-5"
              >
                <Icon className="mb-4 size-5 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{topic.title}</h3>
                <p className="mt-2 mb-5 text-sm leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>
                <Link
                  href={topic.href}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  {topic.action}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>
      </section>
      <section aria-labelledby="support-faqs">
        <div className="mb-5">
          <h2
            id="support-faqs"
            className="text-xl font-semibold tracking-tight"
          >
            Frequently asked questions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick answers to common order and account questions.
          </p>
        </div>
        <Accordion type="single" collapsible>
          {SUPPORT_FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="max-w-3xl leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
                {faq.href && (
                  <Link
                    href={faq.href}
                    className="mt-3 inline-flex items-center gap-2 font-medium text-primary"
                  >
                    {faq.action}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section
        className="flex flex-col gap-5 rounded-2xl border bg-secondary/30 p-6 sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby="more-help"
      >
        <div className="flex items-start gap-4">
          <Headphones
            className="mt-1 size-6 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <h2 id="more-help" className="font-semibold">
              Still need a hand?
            </h2>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Include your order or invoice number and a short description of
              the issue so we can help you find the next step.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <a href={`mailto:`}>
            <Mail /> Email support
          </a>
        </Button>
      </section>
    </div>
  )
}
