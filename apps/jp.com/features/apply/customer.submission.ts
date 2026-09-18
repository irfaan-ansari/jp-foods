import { z } from "zod"
import { customerSchema } from "./customer.schema"
import { uploadedFileSchema } from "../site/uploads/upload.schema"
import { phoneSchema } from "../site/site.schema"
export const customerSubmissionSchema = customerSchema
  .omit({
    step: true,
    certificate: true,
    dlFront: true,
    dlBack: true,
    signature: true,
    consent: true,
  })
  .extend({
    companyEmail: z.email(),
    certificateUrl: uploadedFileSchema,
    dlFrontUrl: uploadedFileSchema,
    dlBackUrl: uploadedFileSchema,
    signatureUrl: uploadedFileSchema,
  })
export const customerInformationSchema = z.object({
  companyName: z.string().min(1),
  companyPhone: phoneSchema,
  companyEmail: z.email(),
  officerFirst: z.string().min(1),
  officerLast: z.string(),
  officerEmail: z.email(),
  officerMobile: phoneSchema,
  orderingName: z.string().min(1),
  orderingPhone: phoneSchema,
  deliverySchedule: z
    .array(
      z.object({
        day: z.string(),
        window: z.string(),
        receivingName: z.string().min(1),
        receivingPhone: phoneSchema,
        instructions: z.string(),
      })
    )
    .min(1),
  certificateUrl: uploadedFileSchema,
})
