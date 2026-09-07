import React from "react"
import Link from "next/link"
import { UndoLeft } from "@solar-icons/react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@jp/ui/components/empty"
import { Button } from "@jp/ui/components/button"
import { PageContent, PageHeader } from "@/components/page-content"

const NotFound = () => {
  return (
    <React.Fragment>
      <PageHeader title="Not Found" />
      <PageContent>
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyMedia className="mb-6">
              <img src="/404.svg" width={140} />
            </EmptyMedia>
            <EmptyTitle className="text-base font-semibold">
              Oops! We couldn't find that page.
            </EmptyTitle>
            <EmptyDescription>
              Sorry, the page you're looking for doesn't exist, may have been
              moved, or the link is incorrect.
            </EmptyDescription>

            <Button asChild variant="link">
              <Link href="/">
                <UndoLeft />
                Back to home
              </Link>
            </Button>
          </EmptyHeader>
        </Empty>
      </PageContent>
    </React.Fragment>
  )
}

export default NotFound
