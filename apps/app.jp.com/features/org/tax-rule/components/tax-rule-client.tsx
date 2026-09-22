"use client"

import { DataTable } from "@jp/ui/components/data-table"
import { useRouterStuff } from "@jp/ui/hooks/use-router-stuff"
import { useTaxRules } from "../tax-rule.data"
import { taxRuleColumns } from "./tax-rule-columns"

export const TaxRuleClient = () => {
  const { searchParamsObj } = useRouterStuff()
  const taxRules = useTaxRules(searchParamsObj)

  return (
    <DataTable
      columns={taxRuleColumns}
      data={taxRules.data?.data ?? []}
      getRowId={(rule) => String(rule.id)}
      isLoading={taxRules.isPending}
      error={{
        isError: taxRules.isError,
        title: taxRules.error?.message,
        description: taxRules.error?.description,
      }}
      empty={{
        isEmpty: taxRules.data?.data.length === 0,
        title: "No tax rules found.",
        description: "Try adjusting your search or filters.",
      }}
      pagination={taxRules.data?.pagination}
    />
  )
}
