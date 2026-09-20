import type { PromotionSelectType } from "@jp/db"
import type { PromotionFormValues } from "./promotion.schema"

export type Promotion = Omit<
  PromotionSelectType,
  "placement" | "productIds" | "triggerProductIds"
> &
  PromotionFormValues & {
    placement: PromotionFormValues["placement"]
  }
