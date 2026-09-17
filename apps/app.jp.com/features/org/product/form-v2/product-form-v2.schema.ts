import z from "zod"

const positiveDecimal = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) > 0,
    { message: "Enter a value greater than zero" }
  )

export const productFormV2Schema = z.object({
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
      name: z.string().min(1, "Unit is required"),
      containsUnit: z.string(),
      quantityPerUnit: positiveDecimal,
      price: positiveDecimal,
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

export type ProductFormV2Schema = z.infer<typeof productFormV2Schema>

export const productFormV2Values: ProductFormV2Schema = {
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
      name: "lb",
      containsUnit: "",
      quantityPerUnit: "1",
      price: "",
      minQuantity: "1",
      orderIncreament: "1",
      isBaseUnit: true,
    },
    {
      name: "bag",
      containsUnit: "",
      quantityPerUnit: "10",
      price: "",
      minQuantity: "1",
      orderIncreament: "1",
      isBaseUnit: false,
    },
    {
      name: "case",
      containsUnit: "",
      quantityPerUnit: "5",
      price: "",
      minQuantity: "1",
      orderIncreament: "1",
      isBaseUnit: false,
    },
  ],
}
