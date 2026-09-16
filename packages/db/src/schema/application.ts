import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  jsonb,
  serial,
  integer,
  date,
} from "drizzle-orm/pg-core"

/* -----------------------------
   Customers Table
----------------------------- */
export const customer = pgTable(
  "customer",
  {
    id: serial("id").primaryKey(),
    status: text("status").notNull().default("new"),
    thumbnail: text("thumbnail"),
    /* ---------------- Business Info ---------------- */
    companyName: text("company_name").notNull(),
    companyDBA: text("company_dba").notNull(),
    companyEin: text("company_ein").notNull(),
    companyStreet: text("company_street").notNull(),
    companyCity: text("company_city").notNull(),
    companyState: text("company_state").notNull(),
    companyZip: text("company_zip").notNull(),
    companyPhone: text("company_phone").notNull(),
    companyEmail: text("company_email").notNull(),
    companyType: text("company_type").notNull(),
    /* ---------------- Officer / Contact ---------------- */
    officerFirst: text("officer_first").notNull(),
    officerLast: text("officer_last").notNull(),
    officerRole: text("officer_title").notNull(),
    officerMobile: text("officer_mobile").notNull(),
    officerEmail: text("officer_email").notNull(),
    officerStreet: text("officer_street").notNull(),
    officerCity: text("officer_city").notNull(),
    officerState: text("officer_state").notNull(),
    officerZip: text("officer_zip").notNull(),

    /* ---------------- Additional Contact ---------------- */
    orderingName: text("ordering_name"),
    orderingPhone: text("ordering_phone"),
    accountPayableEmail: text("account_payable_email"),
    guarantorName: text("guarantor_name"),
    guarantorRole: text("guarantor_role"),
    salesRepresentative: text("sales_representative"),
    /* ---------------- Delivery ---------------- */
    lockboxPermission: text("lockbox_permission").notNull(),
    deliverySchedule: jsonb("delivery_schedule")
      .$type<
        {
          day: string
          window: string
          receivingName: string
          receivingPhone: string
          instructions: string
        }[]
      >()
      .notNull(),
    /* ---------------- Authorization ---------------- */
    signatureName: text("signatureName").notNull(),
    acknowledge: boolean("acknowledge").notNull(),
    certificateUrl: text("certificate_url"),
    dlFrontUrl: text("dl_front_url"),
    dlBackUrl: text("dl_back_url"),
    signatureUrl: text("signature_url"),

    /* ---------------- Meta ---------------- */
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("user_id"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    internalNotes: text("internal_notes"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("customer_status_idx").on(table.status),
    index("customer_created_at_idx").on(table.createdAt),
  ]
)
export const customerInvite = pgTable(
  "customer_invite",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    email: text("email").notNull(),
    companyName: text("company_name"),
    type: text("type"), // Invitation / Request
    companyType: text("company_type"),
    status: text("status").notNull().default("invited"), // new / applied / invited / approved / rejected / revoked
    message: text("message"),
    customerId: integer("customer_id").references(() => customer.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: text("reviewed_by"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    internalNotes: text("internal_notes"),
    token: text("token"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdBy: text("created_by"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("customer_invite_status_idx").on(table.status)]
)

export const jobApplication = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    position: text("position").notNull(),
    location: text("location"),
    declaration: boolean("declaration").notNull(),
    applicantName: text("applicant_name").notNull(),
    status: text("status").notNull().default("new"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    dob: date("dob").notNull(),
    socialSecurity: text("social_security").notNull(),
    availableStartDate: date("available_start_date").notNull(),
    hasLegalRights: text("has_legal_rights").notNull(),
    currentAddress: jsonb("current_address")
      .$type<{
        street: string
        city: string
        state: string
        zip: string
        yearsAtAddress: string
      }>()
      .notNull(),
    mailingAddress: jsonb("mailing_address")
      .$type<{
        street: string
        city: string
        state: string
        zip: string
        yearsAtAddress: string
      }>()
      .notNull(),
    addresses: jsonb("addresses")
      .$type<
        {
          street: string
          city: string
          state: string
          zip: string
          yearsAtAddress: string
        }[]
      >()
      .default([]),
    currentLicense: jsonb("current_license").$type<{
      state: string
      licenseNumber: string
      licenseType: string
      endorsements: string
      expiryDate: string
    }>(),
    licenses: jsonb("licenses")
      .$type<
        {
          state: string
          licenseNumber: string
          licenseType: string
          endorsements: string
          expiryDate: string
        }[]
      >()
      .default([]),
    drivingExperiences: jsonb("driving_experiences")
      .$type<
        {
          category: string
          type: string
          fromDate: string
          toDate: string
          approxMilesTotal: string
        }[]
      >()
      .default([]),
    accidentHistory: jsonb("accident_history")
      .$type<
        {
          accidentDate: string
          accidentNature: string
          fatalitiesCount: string
          injuriesCount: string
          chemicalSpill: string
        }[]
      >()
      .default([]),
    trafficConvictions: jsonb("traffic_convictions")
      .$type<
        {
          dateConvicted: string
          violation: string
          state: string
          penalty: string
          licenseDenied: string
          licenseDeniedReason?: string
          licenseSuspended?: string
          licenseSuspendedReason?: string
        }[]
      >()
      .default([]),

    experience: jsonb("experience")
      .$type<
        {
          employerName: string
          phone: string
          address: string
          position: string
          fromDate: string
          toDate: string
          reasonForLeaving: string
          salary: string
          gap?: string
          subjectToFmcsa: string
          safetySensitive: string
        }[]
      >()
      .default([]),

    highSchool: jsonb("high_school").$type<{
      institutionName: string
      fieldOfStudy: string
      location: string
      yearCompleted: string
      details?: string
    }>(),
    collage: jsonb("collage").$type<{
      institutionName: string
      fieldOfStudy: string
      location: string
      yearCompleted: string
      details?: string
    }>(),
    otherEducations: jsonb("other_educations")
      .$type<
        {
          institutionName: string
          fieldOfStudy: string
          location: string
          yearCompleted: string
          details?: string
        }[]
      >()
      .default([]),
    drivingLicenseFrontUrl: text("driving_license_front_url").notNull(),
    drivingLicenseBackUrl: text("driving_license_back_url").notNull(),
    socialSecurityFrontUrl: text("social_security_front_url").notNull(),
    socialSecurityBackUrl: text("social_security_back_url").notNull(),
    dotFrontUrl: text("dot_front_url").notNull(),
    dotBackUrl: text("dot_back_url").notNull(),
    signatureUrl: text("signature_url").notNull(),
    cvUrl: text("cv_url").notNull(),
    agreementUrl: text("agreement_url"),
    agreementDate: text("agreement_date"),
    token: text("token"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    statusReason: text("status_reason"),
    statusDetails: text("status_details"),
    reviewedBy: text("reviewed_id"),
    reviewedAt: timestamp("reviewed_at"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("job_application_position_idx").on(table.position),
    index("job_application_status_idx").on(table.status),
  ]
)

export const jobInvite = pgTable(
  "job_invite",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    position: text("position").notNull(),
    positionSlug: text("position_slug").notNull(),
    phone: text("phone"),
    email: text("email").notNull().unique(),
    status: text("status").notNull().default("invited"),
    message: text("message"),
    applicationId: integer("application_id").references(
      () => jobApplication.id,
      {
        onDelete: "set null",
      }
    ),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("job_invite_status_idx").on(table.status)]
)
