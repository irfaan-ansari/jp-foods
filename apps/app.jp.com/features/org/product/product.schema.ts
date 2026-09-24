import z from "zod"

const nonNegativeDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0,
    { message: "" }
  )

const positiveDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) > 0,
    { message: "" }
  )

export const productFormSchema = z
  .object({
    title: z.string().min(1, "Enter title"),
    description: z.string(),
    itemCode: z.string(),
    status: z.string().min(1, "Select status"),
    price: nonNegativeDecimal,
    uom: z.string().min(1, "Select unit of measure"),
    weightLb: z.string().min(1, "Enter net weight"),
    sellUnit: z.string().min(1, "Select sell unit") /** eg: case|lb */,
    contains: z.string().min(1, "") /** contains uom eg: 1 case = 60 lb */,
    label: z.string(),
    catchWeight: z.boolean(),
    isTaxable: z.boolean(),
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
  })

export type ProductFormSchema = z.infer<typeof productFormSchema>

export const productFormValues = {
  title: "",
  description: "",
  itemCode: "",
  uom: "lb",
  weightLb: "",
  sellUnit: "case",
  catchWeight: false,
  contains: "1",
  label: "",
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
      label: "10LB case",
      price: "10",
      unitConversion: "1",
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
