import { z } from "zod"
import { driverFormSchema, jobFormSchema } from "./careers.schema"
import { uploadedFileSchema } from "../site/uploads/upload.schema"
const omitted = {
  step: true,
  drivingLicenseFront: true,
  drivingLicenseBack: true,
  socialSecurityFront: true,
  socialSecurityBack: true,
  dotFront: true,
  dotBack: true,
  signature: true,
} as const
const urls = {
  drivingLicenseFrontUrl: uploadedFileSchema,
  drivingLicenseBackUrl: uploadedFileSchema,
  socialSecurityFrontUrl: uploadedFileSchema,
  socialSecurityBackUrl: uploadedFileSchema,
  dotFrontUrl: z.union([uploadedFileSchema, z.literal("")]),
  dotBackUrl: z.union([uploadedFileSchema, z.literal("")]),
  signatureUrl: uploadedFileSchema,
  cvUrl: z.union([uploadedFileSchema, z.literal("")]),
  dob: z.iso.date(),
  availableStartDate: z.iso.date(),
}
export const driverSubmissionSchema = driverFormSchema
  .omit(omitted)
  .extend(urls)
export const managerSubmissionSchema = jobFormSchema.omit(omitted).extend(urls)
