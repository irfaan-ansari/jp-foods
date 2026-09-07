import { TaxRuleSelectType } from "@jp/db"

export type TaxRule = TaxRuleSelectType & {
  customerCount: number
}
