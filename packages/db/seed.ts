import "dotenv/config"

import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { sql, type InferInsertModel } from "drizzle-orm"
import { customer, db, jobApplication } from "@jp/db"

const rootDir = dirname(fileURLToPath(import.meta.url))
type CustomerInsertType = InferInsertModel<typeof customer>
type JobApplicationInsertType = InferInsertModel<typeof jobApplication>

async function readJson<T>(fileName: string): Promise<T[]> {
  const file = await readFile(join(rootDir, fileName), "utf8")
  return JSON.parse(file) as T[]
}

function timestamp(value: unknown) {
  if (!value) return null
  if (value instanceof Date) return value

  return new Date(String(value).replace(" ", "T"))
}

function normalizeCandidateStatus(status: unknown) {
  return status === "verification_pending" ? "under_verification" : status
}

function mapCustomer(row: Record<string, any>): CustomerInsertType {
  return {
    id: row.id,
    status: row.status,
    thumbnail: row.thumbnail,
    companyName: row.company_name,
    companyDBA: row.company_dba,
    companyEin: row.company_ein,
    companyStreet: row.company_street,
    companyCity: row.company_city,
    companyState: row.company_state,
    companyZip: row.company_zip,
    companyPhone: row.company_phone,
    companyEmail: row.company_email,
    companyType: row.company_type,
    officerFirst: row.officer_first,
    officerLast: row.officer_last,
    officerRole: row.officer_title,
    officerMobile: row.officer_mobile,
    officerEmail: row.officer_email,
    officerStreet: row.officer_street,
    officerCity: row.officer_city,
    officerState: row.officer_state,
    officerZip: row.officer_zip,
    orderingName: row.ordering_name,
    orderingPhone: row.ordering_phone,
    accountPayableEmail: row.account_payable_email,
    guarantorName: row.guarantor_name,
    guarantorRole: row.guarantor_role,
    salesRepresentative: row.sales_representative,
    lockboxPermission: row.lockbox_permission,
    deliverySchedule: row.delivery_schedule,
    signatureName: row.signatureName,
    acknowledge: row.acknowledge,
    certificateUrl: row.certificate_url,
    dlFrontUrl: row.dl_front_url,
    dlBackUrl: row.dl_back_url,
    signatureUrl: row.signature_url,
    reviewedAt: timestamp(row.reviewed_at),
    reviewedBy: row.user_id,
    statusReason: row.status_reason,
    statusDetails: row.status_details,
    internalNotes: row.internal_notes,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at) ?? new Date(),
  }
}

function mapJobApplication(row: Record<string, any>): JobApplicationInsertType {
  return {
    id: row.id,
    position: row.position,
    location: row.location,
    declaration: row.declaration,
    applicantName: row.applicant_name,
    status: normalizeCandidateStatus(row.status) as string,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    dob: row.dob,
    socialSecurity: row.social_security,
    availableStartDate: row.available_start_date,
    hasLegalRights: row.has_legal_rights,
    currentAddress: row.current_address,
    mailingAddress: row.mailing_address,
    addresses: row.addresses,
    currentLicense: row.current_license,
    licenses: row.licenses,
    drivingExperiences: row.driving_experiences,
    accidentHistory: row.accident_history,
    trafficConvictions: row.traffic_convictions,
    experience: row.experience,
    highSchool: row.high_school,
    collage: row.collage,
    otherEducations: row.other_educations,
    drivingLicenseFrontUrl: row.driving_license_front_url,
    drivingLicenseBackUrl: row.driving_license_back_url,
    socialSecurityFrontUrl: row.social_security_front_url,
    socialSecurityBackUrl: row.social_security_back_url,
    dotFrontUrl: row.dot_front_url,
    dotBackUrl: row.dot_back_url,
    signatureUrl: row.signature_url,
    cvUrl: row.cv_url,
    agreementUrl: row.agreement_url,
    agreementDate: row.agreement_date,
    token: row.token,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    statusReason: row.status_reason,
    statusDetails: row.status_details,
    reviewedBy: row.reviewed_id,
    reviewedAt: timestamp(row.reviewed_at),
    internalNotes: row.internal_notes,
    createdAt: timestamp(row.created_at),
    updatedAt: timestamp(row.updated_at) ?? new Date(),
  }
}

function conflictUpdateSet<T extends Record<string, any>>(
  table: T,
  row: Record<string, unknown>
) {
  const quoteIdentifier = (value: string) => `"${value.replaceAll('"', '""')}"`

  return Object.fromEntries(
    Object.keys(row)
      .filter((key) => key !== "id")
      .map((key) => {
        const column = table[key]

        return [key, sql.raw(`excluded.${quoteIdentifier(column.name)}`)]
      })
  )
}

async function resetSerialSequences() {
  await db.execute(sql`
    SELECT setval(
      pg_get_serial_sequence('customer', 'id'),
      COALESCE((SELECT MAX(id) FROM customer), 1),
      true
    )
  `)

  await db.execute(sql`
    SELECT setval(
      pg_get_serial_sequence('job_applications', 'id'),
      COALESCE((SELECT MAX(id) FROM job_applications), 1),
      true
    )
  `)
}

async function seed() {
  console.log("Seed started")

  const [customers, jobApplications] = await Promise.all([
    readJson<Record<string, any>>("customer.json"),
    readJson<Record<string, any>>("job_applications.json"),
  ])

  const customerRows = customers.map(mapCustomer)
  const jobApplicationRows = jobApplications.map(mapJobApplication)

  if (customerRows.length > 0) {
    await db
      .insert(customer)
      .values(customerRows)
      .onConflictDoUpdate({
        target: customer.id,
        set: conflictUpdateSet(customer, customerRows[0]!),
      })
  }

  if (jobApplicationRows.length > 0) {
    await db
      .insert(jobApplication)
      .values(jobApplicationRows)
      .onConflictDoUpdate({
        target: jobApplication.id,
        set: conflictUpdateSet(jobApplication, jobApplicationRows[0]!),
      })
  }

  await resetSerialSequences()

  console.log(`Imported ${customerRows.length} customers`)
  console.log(`Imported ${jobApplicationRows.length} job applications`)
  console.log("Seed completed")
}

seed().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
