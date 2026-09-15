import z from "zod"

const nonNegativeDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0,
    { message: "Enter a valid amount" }
  )

const positiveDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) > 0,
    { message: "Enter a value greater than zero" }
  )

export const productFormSchema = z.object({
  title: z.string().min(1, "Enter title"),
  description: z.string(),
  itemCode: z.string(),
  status: z.string().min(1, "Select status"),
  isTaxable: z.boolean(),
  categories: z.array(z.string()),
  image: z.string().or(z.any()),
  location: z.string(),
  trackInventory: z.boolean(),
  stock: z.string(),
  allowBackorder: z.boolean("Invalid value"),
  sellUnits: z
    .object({
      id: z.number().optional(),
      name: z.string().min(1, "Unit is required"),
      inventoryPerUnit: positiveDecimal,
      price: nonNegativeDecimal,
      minQuantity: positiveDecimal,
      orderIncreament: positiveDecimal,
      isBaseUnit: z.boolean(),
    })
    .array()
    .min(1, "Add at least one sell unit")
    .refine((units) => units.filter((unit) => unit.isBaseUnit).length === 1, {
      message: "Select exactly one base unit",
    }),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>

export const productFormValues = {
  title: "",
  description: "",
  itemCode: "",
  status: "active",
  isTaxable: false,
  categories: [],
  image: "",
  location: "",
  trackInventory: false,
  stock: "",
  allowBackorder: false,
  sellUnits: [
    {
      name: "case",
      inventoryPerUnit: "1",
      price: "",
      minQuantity: "1",
      orderIncreament: "1",
      isBaseUnit: true,
    },
  ],
}

export const createProductSchema = z.object({
  data: productFormSchema,
})

export const updateProductSchema = z.object({
  id: z.number(),
  data: productFormSchema,
})

export const deleteProductSchema = z.object({
  id: z.number(),
})
