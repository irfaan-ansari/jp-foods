import z from "zod"

const positiveDecimal = z
  .string()
  .or(z.number())
  .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
    message: "Invalid value",
  })

const splitUnitSchema = z.object({
  name: z.string().trim().min(1, "Unit is required"),
  displayLabel: z.string(),
  sellUnitPrice: positiveDecimal,
  unitConversion: positiveDecimal,
})

export const productFormSchema = z.object({
  title: z.string().min(1, "Enter title"),
  description: z.string(),
  itemCode: z.string().trim().min(1, "Enter item code"),
  status: z.string().min(1, "Select status"),

  isTaxable: z.boolean(),
  categories: z.array(z.string()),
  image: z.string(),
  location: z.string(),
  trackInventory: z.boolean(),
  stock: z.string(),
  allowBackorder: z.boolean(),

  stockUOM: z.string().min(1, "Select unit of measure"),
  packSize: positiveDecimal,
  sellUOM: z.string().min(1, "Select selling unit"),
  displayLabel: z.string(),
  pricingBasis: z.enum(["fixed", "per-unit", "catch-weight"]),
  price: positiveDecimal,

  splitUnits: z.array(splitUnitSchema),
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

  stockUOM: "LB",
  sellUOM: "CS",
  pricingBasis: "fixed",
  price: "",
  packSize: "",
  displayLabel: "",
  splitUnits: [],
}

const productActionDataSchema = productFormSchema.extend({
  splitUnits: splitUnitSchema.array().optional(),
})

export const createProductSchema = z.object({
  data: productActionDataSchema,
})

export const updateProductSchema = z.object({
  id: z.number(),
  data: productActionDataSchema,
})

export const deleteProductSchema = z.object({
  id: z.number(),
})
