import z from "zod"

const positiveDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) > 0,
    { message: "Invalid value" }
  )

const sellingUnitSchema = z.object({
  name: z.string().trim().min(1, "Unit is required"),
  displayLabel: z.string(),
  price: positiveDecimal,
  qtyPerUnit: positiveDecimal,
  orderIncrement: positiveDecimal.optional(),
  minOrderQty: positiveDecimal.optional(),
  isDefault: z.boolean(),
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

  uom: z.string().min(1, "Select unit of measure"),
  weightLb: z.string(),
  catchWeight: z.boolean(),

  sellingUnits: z
    .array(sellingUnitSchema)
    .min(1, "Add a selling unit")
    .superRefine((units, ctx) => {
      const names = new Set<string>()
      units.forEach((unit, index) => {
        if (names.has(unit.name))
          ctx.addIssue({
            code: "custom",
            path: [index, "name"],
            message: "Selling units must be unique",
          })
        names.add(unit.name)
      })
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

  uom: "lb",
  weightLb: "",
  catchWeight: false,

  sellingUnits: [
    {
      name: "case",
      displayLabel: "",
      price: "",
      qtyPerUnit: "",
      isDefault: true,
    },
  ],
}

const productActionDataSchema = productFormSchema.extend({
  sellingUnits: z
    .array(sellingUnitSchema.extend({ isDefault: z.boolean().default(false) }))
    .pipe(productFormSchema.shape.sellingUnits),
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
