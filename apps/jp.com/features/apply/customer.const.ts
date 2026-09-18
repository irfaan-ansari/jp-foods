import { CustomerFormType } from "@/features/apply/customer.schema"

export const DEFAULT_VALUES: CustomerFormType = {
  step: 0,

  companyName: "",
  companyType: "",
  companyDBA: "",
  companyEin: "",
  companyStreet: "",
  companyCity: "",
  companyState: "",
  companyZip: "",
  companyPhone: "",
  companyEmail: "",

  officerFirst: "",
  officerLast: "",
  officerRole: "",
  officerMobile: "",
  officerEmail: "",
  officerStreet: "",
  officerCity: "",
  officerState: "",
  officerZip: "",

  orderingName: "",
  orderingPhone: "",
  accountPayableEmail: "",
  guarantorName: "",
  guarantorRole: "",
  salesRepresentative: "",

  lockboxPermission: "",
  deliverySchedule: [
    {
      day: "",
      window: "",
      receivingName: "",
      receivingPhone: "",
      instructions: "",
    },
  ],

  certificate: null as any,
  dlFront: null as any,
  dlBack: null as any,

  signature: null as any,
  signatureName: "",
  acknowledge: false,
  consent: false,
}

/**
 * constants
 */
export const BUSINESS_TYPES = [
  "Restaurant",
  "Retail",
  "Health Care",
  "Education",
  "Food Truck",
  "Other",
]

export const ROLES = [
  "Owner",
  "Management",
  "Chef / Culinary / Accounting",
  "Marketing",
  "CEO",
  "CFO",
  "VP",
  "Other",
]
export const SALES_REPRESENTATIVE = [
  "Elizabeth",
  "Jorge",
  "Yhessenia",
  "Luisa",
  "Other",
]

export const SALES_REPS = {
  Elizabeth: "elizabeth@jimenezproduce.com",
  Jorge: "jorge@jimenezproduce.com",
  Yhessenia: "yhessenia@jimenezproduce.com",
}

export const DELIVERY_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export const DELIVERY_TIME = [
  "6:00 AM – 9:00 AM",
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 9:00 PM",
  "Anytime",
]
