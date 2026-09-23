export type SplitDraft = {
  id: string
  uom: string
  unitsPerCase: string
  casePrice: string
  minQuantity: string
}

export type PricingDraft = {
  uom: string
  sellAs: string
  contents: string
  weightMode: "fixed" | "average"
  price: string
  allowSplit: boolean
  splits: SplitDraft[]
}

export const validAmount = (value: string, positive = false) =>
  value.trim() !== "" &&
  Number.isFinite(Number(value)) &&
  (positive ? Number(value) > 0 : Number(value) >= 0)

export function validPackageQuantity(value: string, minimum: string) {
  return (
    [value, minimum].every(
      (item) => validAmount(item, true) && Number.isInteger(Number(item))
    ) && Number(value) >= Number(minimum)
  )
}

// Only used by the local new-2 form and its preview.
export function calculatePricing(draft: PricingDraft, split?: SplitDraft) {
  const average = draft.weightMode === "average"
  const baseValid =
    validAmount(draft.contents, true) && validAmount(draft.price)
  const contents = Number(draft.contents)
  const rate = average ? Number(draft.price) : Number(draft.price) / contents
  const packagePrice = average ? contents * rate : Number(draft.price)
  const splits = Number(split?.unitsPerCase ?? "")
  const splitSizeValid =
    validAmount(draft.contents, true) &&
    validAmount(split?.unitsPerCase ?? "", true) &&
    Number.isInteger(splits) &&
    splits >= 2
  const splitContents = splitSizeValid ? contents / splits : 0
  const splitValid = splitSizeValid && validAmount(split?.casePrice ?? "")
  // Split pricing is an independent full-case equivalent, never an add-on.
  const splitCasePrice = Number(split?.casePrice ?? "")
  const splitRate = Number((splitCasePrice / contents).toFixed(6))
  const splitPackagePrice = average
    ? splitContents * splitRate
    : Number((splitCasePrice / splits).toFixed(2))
  return {
    average,
    baseValid:
      baseValid && Number.isFinite(packagePrice) && Number.isFinite(rate),
    splitSizeValid,
    splitValid:
      splitValid &&
      Number.isFinite(splitPackagePrice) &&
      Number.isFinite(splitRate),
    rate,
    packagePrice,
    splits,
    splitContents,
    splitCasePrice,
    splitRate,
    splitPackagePrice,
  }
}
