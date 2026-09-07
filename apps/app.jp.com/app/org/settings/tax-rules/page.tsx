"use client"

import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@jp/ui/components/button"
import { PageContent, PageHeader } from "@/components/page-content"
import { TaxRuleClient } from "@/features/org/tax-rule/components/tax-rule-client"
import { FilterTab } from "@/components/filter-tabs"
import { OrgAccess } from "@/features/auth/components/org-permission"
import { SearchQueryParam } from "@jp/ui/components/jp/search-input"

const OPTIONS = [{ label: "All", value: "", color: "#A1A1AA" }]

const TaxRulePage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Tax Rules">
        <OrgAccess
          permission={{ taxRule: ["create"] }}
          children={(disabled) => (
            <Button disabled={disabled}>
              <Plus />
              Add New
            </Button>
          )}
        />
      </PageHeader>
      <PageContent className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <FilterTab tabs={OPTIONS} path="/org/tax-rules/count" />
          <SearchQueryParam />
        </div>
        <TaxRuleClient />
      </PageContent>
    </React.Fragment>
  )
}

export default TaxRulePage
