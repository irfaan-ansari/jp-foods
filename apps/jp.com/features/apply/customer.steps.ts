import { BusinessDetails } from "@/features/apply/forms/business-details"
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
} from "@/features/apply/customer.schema"
import { BusinessContact } from "@/features/apply/forms/business-contact"
import { BusinessAdditionalContact } from "@/features/apply/forms/additional-contact"
import { BusinessDelivery } from "@/features/apply/forms/business-delivery"
import { Authorization } from "@/features/apply/forms/business-authorization"
import z from "zod"
import {
  Building2,
  FileText,
  Truck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Documents } from "@/features/apply/forms/business-documents"

type StepConfig = {
  key: string
  component: React.ComponentType<any>
  schema: z.ZodObject<any>
  icon: LucideIcon
}

export const steps: StepConfig[] = [
  {
    key: "step-0",
    icon: Building2,
    component: BusinessDetails,
    schema: step1Schema,
  },
  {
    key: "step-1",
    component: BusinessContact,
    schema: step2Schema,
    icon: UserRound,
  },
  {
    key: "step-2",
    component: BusinessAdditionalContact,
    schema: step3Schema,
    icon: Users,
  },
  {
    key: "step-3",
    component: BusinessDelivery,
    schema: step4Schema,
    icon: Truck,
  },
  {
    key: "step-4",
    component: Documents,
    schema: step5Schema,
    icon: FileText,
  },
  {
    key: "step-5",
    component: Authorization,
    schema: step6Schema,
    icon: FileText,
  },
]
