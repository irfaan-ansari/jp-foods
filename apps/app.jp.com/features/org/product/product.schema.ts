import { numberSchema } from "@jp/utils"
import z from "zod"

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
      inventoryPerUnit: numberSchema,
      price: numberSchema,
      minQuantity: numberSchema,
      orderIncreament: numberSchema,
      isBaseUnit: z.boolean(),
    })
    .array(),
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
      inventoryPerUnit: "",
      price: "",
      minQuantity: "",
      orderIncreament: "",
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
