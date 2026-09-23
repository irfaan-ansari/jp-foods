import z from "zod"

const requiredDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0,
    "Enter a valid number"
  )

const positiveWhole = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isInteger(Number(value)) &&
      Number(value) > 0,
    "Enter a whole number greater than zero"
  )

export const productNew2SplitSchema = z.object({
  id: z.string(),
  uom: z.string().min(1, "Select a split unit"),
  unitsPerCase: positiveWhole,
  casePrice: requiredDecimal,
  minQuantity: positiveWhole,
})

export const productNew2Schema = z.object({
  title: z.string().min(1, "Enter an item name"),
  description: z.string(),
  itemCode: z.string().min(1, "Enter an item number"),
  status: z.string().min(1, "Select a status"),
  categories: z.string(),
  isTaxable: z.boolean(),
  trackInventory: z.boolean(),
  stock: requiredDecimal,
  allowBackorder: z.boolean(),
  location: z.string(),
  uom: z.string().min(1, "Select a unit of measure"),
  sellAs: z.string().min(1, "Select an order unit"),
  contents: requiredDecimal,
  weightMode: z.enum(["fixed", "average"]),
  price: requiredDecimal,
  minQuantity: positiveWhole,
  allowSplit: z.boolean(),
  splits: z.array(productNew2SplitSchema),
})

export type ProductNew2Schema = z.infer<typeof productNew2Schema>
export type ProductNew2Split = z.infer<typeof productNew2SplitSchema>

export const productNew2Values: ProductNew2Schema = {
  title: "",
  description: "",
  itemCode: "",
  status: "active",
  categories: "",
  isTaxable: false,
  trackInventory: false,
  stock: "0",
  allowBackorder: false,
  location: "",
  uom: "lb",
  sellAs: "case",
  contents: "",
  weightMode: "fixed",
  price: "",
  minQuantity: "1",
  allowSplit: false,
  splits: [],
}
