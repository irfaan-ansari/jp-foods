import {
  PriceLevelItemSelectType,
  ProductSelectType,
  TaxRuleSelectType,
  TeamSelectType,
} from "@jp/db"

export type Team = TeamSelectType & {
  metadata: Record<string, string>
}

export type ActiveTeam = Team & {
  taxRule?: TaxRuleSelectType
}

export type PriceResolverProduct = ProductSelectType
export type PriceLevelItem = PriceLevelItemSelectType
