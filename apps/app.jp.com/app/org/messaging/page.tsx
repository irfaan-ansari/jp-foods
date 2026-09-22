"use client"

import React from "react"
import { SearchQueryParam } from "@jp/ui/components/jp"

import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { MessageCampaignClient } from "@/features/org/messaging/components/message-campaign-client"
import { MessageComposeDialog } from "@/features/org/messaging/components/message-compose"
import { MESSAGE_STATUS } from "@/features/org/messaging/messaging.const"
import { Button } from "@jp/ui/components/button"
import { Send } from "lucide-react"

const OPTIONS = [
  MESSAGE_STATUS.all!,
  MESSAGE_STATUS.completed!,
  MESSAGE_STATUS.partial!,
  MESSAGE_STATUS.failed!,
]

const MessagingPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Messaging">
        <MessageComposeDialog>
          <Button>
            <Send /> Compose
          </Button>
        </MessageComposeDialog>
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterTab tabs={OPTIONS} path="/org/messaging/count" />
          <SearchQueryParam
            className="w-full max-w-none lg:max-w-xs"
            placeholder="Search campaigns..."
          />
        </div>
        <MessageCampaignClient />
      </PageContent>
    </React.Fragment>
  )
}

export default MessagingPage
