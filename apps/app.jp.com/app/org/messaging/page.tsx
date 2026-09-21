"use client"

import React from "react"
import { SearchQueryParam } from "@jp/ui/components/jp"

import { FilterTab } from "@/components/filter-tabs"
import { PageContent, PageHeader } from "@/components/page-content"
import { MessageCampaignClient } from "@/features/org/messaging/components/message-campaign-client"
import { MessageCompose } from "@/features/org/messaging/components/message-compose"
import { MESSAGE_STATUS } from "@/features/org/messaging/messaging.const"

const OPTIONS = [
  MESSAGE_STATUS.all!,
  MESSAGE_STATUS.completed!,
  MESSAGE_STATUS.partial!,
  MESSAGE_STATUS.failed!,
]

const MessagingPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Messaging" />
      <PageContent className="space-y-6">
        <MessageCompose />
        <div className="space-y-4">
          <div className="flex gap-4">
            <FilterTab tabs={OPTIONS} path="/org/messaging/count" />
            <SearchQueryParam className="ml-auto" />
          </div>
          <MessageCampaignClient />
        </div>
      </PageContent>
    </React.Fragment>
  )
}

export default MessagingPage
