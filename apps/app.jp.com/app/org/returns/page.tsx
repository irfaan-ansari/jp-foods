"use client"

import React from "react"
import { DataTable } from "@jp/ui/components/data-table"
import { PageContent, PageHeader } from "@/components/page-content"

import { returnColumns } from "@/features/org/return/components/return-columns"
import { DUMMY_RETURNS } from "@/features/org/return/return.const"

const ReturnsPage = () => {
  return (
    <React.Fragment>
      <PageHeader title="Returns" />
      <PageContent className="space-y-6">
        <DataTable
          columns={returnColumns}
          data={DUMMY_RETURNS}
          empty={{
            isEmpty: DUMMY_RETURNS.length === 0,
            title: "No returns found.",
            description: "Returns will appear here when they are created.",
          }}
        />
      </PageContent>
    </React.Fragment>
  )
}

export default ReturnsPage
