import z from "zod"

const sellUnitSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
})
const privateItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  itemCode: z.string(),
  image: z.string(),
  sellUnits: z.array(sellUnitSchema),
})

const userSchema = z.object({
  id: z.string(),
  image: z.string().nullable(),
  name: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
})

export const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  managerName: z.string().min(1, "Manager name is required"),
  email: z.email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone is required"),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  status: z.enum(["active", "inactive"]),
  creditEnabled: z.boolean(),
  creditLimit: z.string(),
  taxRule: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  priceLevel: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),

  salesRep: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  privateItems: privateItemSchema.array(),
  teamMembers: userSchema.array(),
})

export type TeamFormValues = z.infer<typeof teamSchema>

export const teamDefaultValues: TeamFormValues = {
  name: "",
  managerName: "",
  email: "",
  phoneNumber: "",
  street: "",
  city: "",
  state: "",
  zipcode: "",
  status: "active",
  creditEnabled: false,
  creditLimit: "",
  taxRule: null,
  priceLevel: null,
  salesRep: null,
  privateItems: [],
  teamMembers: [],
}

const teamDataSchema = teamSchema
  .omit({ taxRule: true, priceLevel: true, salesRep: true, teamMembers: true })
  .extend({
    taxRuleId: z.number().nullable(),
    priceLevelId: z.number().nullable(),
    salesRepId: z.string().nullable(), // member with role sales
    userIds: z.string().array().nullable(),
  })

export const teamCreateSchema = z.object({
  data: teamDataSchema,
})

export const teamUpdateSchema = z.object({
  id: z.string(),
  data: teamDataSchema,
})
