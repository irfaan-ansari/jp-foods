import Image from "next/image"

import { format } from "@jp/utils/date"
import { redirect } from "next/navigation"

import { Container } from "@/components/container"
import { ArrowDown, FileCheck2, PenLine } from "lucide-react"
import { getJobApplication } from "@/features/careers/agreement.action"
import { JobAgreementButton } from "@/features/careers/components/agreement-button"

import {
  AGREEMENT_POLICIES,
  AGREEMENT_COPY,
} from "@/features/careers/agreement.const"

const Agreement = async ({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) => {
  const { token } = await searchParams
  if (!token) redirect("/careers")

  const { data, success } = await getJobApplication(token)

  if (!success || !data) redirect("/careers")

  const { name, position, facility, signatureUrl } = data

  return (
    <>
      <section className="border-b bg-secondary/40">
        <Container className="max-w-7xl py-10 sm:py-14">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                <FileCheck2 className="size-5" />
                Joining Jimenez Produce
              </p>
              <h1 className="font-heading text-4xl/tight font-semibold tracking-tight sm:text-5xl/tight">
                Your employment agreement.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                Review our employment terms and workplace policies, then confirm
                your acknowledgment below.
              </p>
            </div>
            <a
              href="#acknowledgment"
              className="inline-flex w-fit items-center gap-3 rounded-full border bg-background px-5 py-3 text-sm font-medium hover:bg-secondary"
            >
              Go to acknowledgment
              <ArrowDown className="size-4" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t pt-5 text-sm">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground">{position}</span>
            <span className="text-muted-foreground">{facility}</span>
          </div>
        </Container>
      </section>
      <Container className="max-w-7xl py-10 sm:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <article className="min-w-0 rounded-2xl border bg-background px-6 py-8 sm:px-10">
            <div className="border-b pb-7">
              <p className="text-sm font-medium text-primary">
                Employee onboarding
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Terms & workplace policies
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {AGREEMENT_COPY.introduction}
              </p>
            </div>
            <div className="divide-y">
              {AGREEMENT_POLICIES.map((policy, index) => (
                <section key={policy.title} className="py-7 last:pb-0">
                  <h3 className="mb-4 flex items-start gap-3 text-lg leading-7 font-semibold">
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm text-primary">
                      {index + 1}
                    </span>
                    {policy.title}
                  </h3>
                  <p className="text-base leading-7 text-muted-foreground">
                    {policy.text}
                  </p>
                </section>
              ))}
            </div>
          </article>
          <aside
            id="acknowledgment"
            className="scroll-mt-24 rounded-2xl border bg-secondary/30 p-6 sm:p-7 lg:sticky lg:top-24"
          >
            <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PenLine className="size-5" />
            </div>
            <h2 className="font-heading text-2xl font-semibold">
              Your acknowledgment
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Review all eight sections before submitting your agreement.
            </p>
            <dl className="my-6 space-y-4 border-y py-5 text-sm">
              <div>
                <dt className="text-muted-foreground">
                  Employee full legal name
                </dt>
                <dd className="mt-1 font-medium">{name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Position</dt>
                <dd className="mt-1 font-medium">{position}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Facility</dt>
                <dd className="mt-1 font-medium">
                  {facility || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Date</dt>
                <dd className="mt-1 font-medium">
                  {format(new Date(), "MMMM dd, yyyy")}
                </dd>
              </div>
            </dl>
            {signatureUrl && (
              <div className="mb-6">
                <p className="mb-3 text-sm text-muted-foreground">
                  Your application signature
                </p>
                <div className="rounded-xl border bg-white p-4">
                  <Image
                    src={signatureUrl}
                    width={240}
                    height={100}
                    className="h-24 w-full object-contain object-left"
                    alt="Employee signature"
                  />
                </div>
              </div>
            )}
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              {AGREEMENT_COPY.acknowledgment}
            </p>
            <JobAgreementButton token={token} />
          </aside>
        </div>
      </Container>
    </>
  )
}
export default Agreement
