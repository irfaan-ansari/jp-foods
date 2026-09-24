import z from "zod"

const nonNegativeDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0,
    { message: "Enter a valid price" }
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

export const productFormSchema = z
  .object({
    title: z.string().min(1, "Enter title"),
    description: z.string(),
    itemCode: z.string(),
    status: z.string().min(1, "Select status"),
    price: nonNegativeDecimal,
    uom: z.string().min(1, "Select unit of measure"),
    weightUnit: z.string().min(1, "Select weight of measure"),
    netWeight: z.string().min(1, "Enter net weight"),
    sellUnit: z.string().min(1, "Select sell unit") /** eg: case|lb */,
    unitSize: z
      .string()
      .min(1, "Enter unit size") /** contains uom eg: 1 case = 60 lb */,
    packSize: z.string() /** eg: pack of 1 */,
    catchWeight: z.boolean(),
    isTaxable: z.boolean(),
    enableSplit: z.boolean(),
    categories: z.array(z.string()),
    image: z.string(),
    location: z.string(),
    trackInventory: z.boolean(),
    stock: z.string(),
    allowBackorder: z.boolean("Invalid value"),
    sellUnits: z
      .object({
        name: z.string().min(1, "Unit is required"),
        label: z.string(),
        price: z.string(),
        unitConversion: positiveDecimal,
        minQuantity: positiveDecimal,
        orderIncreament: positiveDecimal,
      })
      .array()
      .min(1, "Add at least one sell unit")
      .refine(
        (units) =>
          new Set(units.map((unit) => unit.name)).size === units.length,
        {
          message: "Selling units must be unique",
        }
      ),
  })
  .superRefine((value, ctx) => {
    if (
      value.trackInventory &&
      !nonNegativeDecimal.safeParse(value.stock).success
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["stock"],
        message: "Enter a valid stock quantity",
      })
    }

    if (value.enableSplit) {
      value.sellUnits.forEach((unit, index) => {
        if (unit.name === value.sellUnit) return

        if (!unit.label.trim()) {
          ctx.addIssue({
            code: "custom",
            path: ["sellUnits", index, "label"],
            message: "Enter a split label",
          })
        }

        if (!nonNegativeDecimal.safeParse(unit.price).success) {
          ctx.addIssue({
            code: "custom",
            path: ["sellUnits", index, "price"],
            message: "Enter a split price",
          })
        }
      })
    }
  })

export type ProductFormSchema = z.infer<typeof productFormSchema>

export const productFormValues = {
  title: "",
  description: "",
  itemCode: "",
  uom: "lb",
  sellUnit: "case",
  catchWeight: false,
  unitSize: "1",
  packSize: "",
  enableSplit: false,
  price: "",
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
      label: "Case",
      price: "",
      unitConversion: "1",
      minQuantity: "1",
      orderIncreament: "1",
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
