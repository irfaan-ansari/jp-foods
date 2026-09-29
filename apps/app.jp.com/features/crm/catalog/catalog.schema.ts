import z from "zod"

export const updateCatalogInquirySchema = z.object({
  id: z.number().positive(),
  data: z.object({
    status: z.string(),
  }),
})

export const sendCatalogInquiryLinkSchema = z.object({
  id: z.number().positive(),
})

export const deleteCatalogInquirySchema = z.object({
  id: z.number().positive(),
})
