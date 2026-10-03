import { Document, Text, View, Image } from "@react-pdf/renderer"
import { format, isValid, parseISO } from "date-fns"
import { ApplicationPage } from "./application-layout"
import { COLORS, styles } from "./styles"

function displayDate(value: string | Date | null | undefined) {
  if (!value) return "Not provided"
  const date = typeof value === "string" ? parseISO(value) : value
  return isValid(date) ? format(date, "MMM d, yyyy") : "Not provided"
}

function address(value: Record<string, any> | null | undefined) {
  return (
    [value?.street, value?.city, value?.state, value?.zip]
      .filter(Boolean)
      .join(", ") || "Not provided"
  )
}

export const JobApplicationPDF = ({
  data,
  includeSSN = false,
}: {
  data: Record<string, any>
  includeSSN?: boolean
}) => (
  <Document
    title={`Candidate Application - ${data.applicantName || "Applicant"}`}
    author="Jimenez Produce"
  >
    {/* PAGE 1: Personal & Driving Info */}
    <ApplicationPage title="Candidate application">
      <View style={styles.header} wrap={false}>
        <Text style={styles.eyebrow}>EMPLOYMENT APPLICATION</Text>
        <Text style={styles.docTitle}>{data.applicantName || "Applicant"}</Text>
        <Text style={styles.tagline}>
          {[data.position, data.location].filter(Boolean).join("  /  ")}
        </Text>
        <View style={styles.summary}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Application reference</Text>
            <Text style={styles.value}>
              {data.id
                ? `CAND-${String(data.id).padStart(6, "0")}`
                : "Not provided"}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Submitted</Text>
            <Text style={styles.value}>{displayDate(data.createdAt)}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Available to start</Text>
            <Text style={styles.value}>
              {displayDate(data.availableStartDate)}
            </Text>
          </View>
        </View>
      </View>
      {/* body */}
      <Text style={styles.sectionTitle} minPresenceAhead={45}>
        Personal Information
      </Text>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{data.applicantName}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{displayDate(data.dob)}</Text>
        </View>
      </View>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Available Date</Text>
          <Text style={styles.value}>
            {displayDate(data.availableStartDate)}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Social Security #</Text>
          <Text style={styles.value}>
            {includeSSN ? data.socialSecurity : "XXX-XX-XXXX"}
          </Text>
        </View>
      </View>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Work authorization</Text>
          <Text style={[styles.value, { textTransform: "capitalize" }]}>
            {data.hasLegalRights}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contact Details</Text>
          <Text style={styles.value}>{data.phone}</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
      </View>

      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Address</Text>
          <Text style={styles.value}>{address(data.currentAddress)}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Mailing Address</Text>
          <Text style={styles.value}>{address(data.mailingAddress)}</Text>
        </View>
      </View>

      {/* education */}
      <Text style={styles.sectionTitle} minPresenceAhead={45}>
        Education / High School
      </Text>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{data.highSchool?.institutionName}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Field of Study</Text>
          <Text style={styles.value}>{data.highSchool?.fieldOfStudy}</Text>
        </View>
      </View>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{data.highSchool?.location}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Year Completed</Text>
          <Text style={styles.value}>{data.highSchool?.yearCompleted}</Text>
        </View>
      </View>
      {data.highSchool?.details && (
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>{data.highSchool?.details}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle} minPresenceAhead={45}>
        Education / College
      </Text>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Institution Name</Text>
          <Text style={styles.value}>{data.collage?.institutionName}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Field of Study</Text>
          <Text style={styles.value}>{data.collage?.fieldOfStudy}</Text>
        </View>
      </View>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{data.collage?.location}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Year Completed</Text>
          <Text style={styles.value}>{data.collage?.yearCompleted}</Text>
        </View>
      </View>
      {data.collage?.details && (
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Details</Text>
            <Text style={styles.value}>{data.collage?.details}</Text>
          </View>
        </View>
      )}
      {data.otherEducations && data.otherEducations?.length > 0 && (
        <>
          <Text style={styles.sectionTitle} minPresenceAhead={45}>
            Education / Additional Training
          </Text>

          {data.otherEducations.map((edu: Record<string, any>, i: number) => (
            <View key={i} style={styles.record}>
              <View style={styles.row} wrap={false}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Institution Name</Text>
                  <Text style={styles.value}>{edu.institutionName}</Text>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Field of Study</Text>
                  <Text style={styles.value}>{edu.fieldOfStudy}</Text>
                </View>
              </View>
              <View style={styles.row} wrap={false}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Location</Text>
                  <Text style={styles.value}>{edu.location}</Text>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Year Completed</Text>
                  <Text style={styles.value}>{edu.yearCompleted}</Text>
                </View>
              </View>
              {edu.details && (
                <View style={styles.row} wrap={false}>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Details</Text>
                    <Text style={styles.value}>{edu.details}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </>
      )}

      {/* Employment history */}
      <Text style={styles.sectionTitle} minPresenceAhead={45}>
        Employment History
      </Text>

      {data.experience &&
        data.experience.length > 0 &&
        data.experience.map((exp: Record<string, any>, i: number) => (
          <View key={i} style={styles.record}>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer Name</Text>
                <Text style={styles.value}>{exp.employerName}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer Phone</Text>
                <Text style={styles.value}>{exp.phone}</Text>
              </View>
            </View>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employer Address</Text>
                <Text style={styles.value}>{exp.address}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Position</Text>
                <Text style={styles.value}>{exp.position}</Text>
              </View>
            </View>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>
                  {displayDate(exp.fromDate) + " - " + displayDate(exp.toDate)}
                </Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Salary</Text>
                <Text style={styles.value}>{exp.salary}</Text>
              </View>
            </View>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>FMCSR Applied</Text>
                <Text style={[styles.value, { textTransform: "capitalize" }]}>
                  {exp.subjectToFmcsa}
                </Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Safety-Sensitive (DOT)</Text>
                <Text style={[styles.value, { textTransform: "capitalize" }]}>
                  {exp.safetySensitive}
                </Text>
              </View>
            </View>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Reason for Leaving</Text>
                <Text style={styles.value}>{exp.reasonForLeaving}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Employment Gaps</Text>
                <Text style={styles.value}>{exp.gap}</Text>
              </View>
            </View>
          </View>
        ))}

      {/* license */}
      <Text style={styles.sectionTitle} minPresenceAhead={45}>
        License
      </Text>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>License #</Text>
          <Text style={styles.value}>{data.currentLicense?.licenseNumber}</Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Type/Class</Text>
          <Text style={styles.value}>{data.currentLicense?.licenseType}</Text>
        </View>
      </View>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <Text style={styles.value}>
            {displayDate(data.currentLicense?.expiryDate!)}
          </Text>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Endorsements</Text>
          <Text style={styles.value}>{data.currentLicense?.endorsements}</Text>
        </View>
      </View>
      <View style={styles.row} wrap={false}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Issuing State</Text>
          <Text style={styles.value}>{data.currentLicense?.state}</Text>
        </View>
      </View>

      {/* Driving Experience */}
      <Text style={styles.sectionTitle} minPresenceAhead={45}>
        Driving Experience
      </Text>
      {data.drivingExperiences &&
        data.drivingExperiences.map((exp: Record<string, any>, i: number) => (
          <View key={i} style={styles.record}>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Category</Text>
                <Text style={styles.value}>{exp.category}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>{exp.type}</Text>
              </View>
            </View>
            <View style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Duration</Text>
                <Text style={styles.value}>
                  {displayDate(exp.fromDate) + " - " + displayDate(exp.toDate)}
                </Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Approx Miles Total</Text>
                <Text style={styles.value}>{exp.approxMilesTotal}</Text>
              </View>
            </View>
          </View>
        ))}

      {data.addresses?.length > 0 && (
        <View>
          <Text style={styles.sectionTitle} minPresenceAhead={45}>
            Address History
          </Text>
          {data.addresses.map((item: Record<string, any>, i: number) => (
            <View key={i} style={styles.row} wrap={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Previous address {i + 1}</Text>
                <Text style={styles.value}>{address(item)}</Text>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Years at address</Text>
                <Text style={styles.value}>
                  {item.yearsAtAddress || "Not provided"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View>
        <Text style={styles.sectionTitle} minPresenceAhead={45}>
          Acknowledgement{" "}
        </Text>
        <View>
          <Text style={styles.legal}>
            I, {data.applicantName}, authorize you to make investigations
            (including contacting current and prior employers) into my personal,
            employment, financial, medical history, and other related matters as
            may be necessary in arriving at an employment decision. I hereby
            release employers, schools, health care providers, and other persons
            from all liability in responding to inquiries and releasing
            information in connection with my application.
          </Text>
          <Text style={styles.legal}>
            In the event of employment, I understand that false or misleading
            information given in my application or interview(s) may result in
            discharge. I also understand that I am required to abide by all
            rules and regulations of the Company.
          </Text>
          <Text style={styles.legal}>
            I understand that the information I provide regarding my current
            and/or prior employers may be used, and those employer(s) will be
            contacted for the purpose of investigating my safety performance
            history as required by 49 CFR 391.23. I understand that I have the
            right to review information, have errors corrected, and attach a
            rebuttal statement where applicable.
          </Text>
          <Text style={styles.legal}>
            This certifies that I completed this application, and that all
            entries on it and information in it are true and complete to the
            best of my knowledge. Note: A motor carrier may require an applicant
            to provide more information than that required by the Federal Motor
            Carrier Safety Regulations.
          </Text>
        </View>
      </View>
      <View wrap={false}>
        <Text style={styles.sectionTitle} minPresenceAhead={45}>
          Declaration
        </Text>
        <Text style={styles.legal}>
          I {data.applicantName} confirm the information provided is accurate
          and the documents uploaded belong to me and are clear, complete, and
          unedited.
        </Text>

        <View style={[styles.row, { marginTop: 10 }]}>
          <View style={styles.signatureBlock}>
            {data.signatureUrl && (
              <Image src={data.signatureUrl} style={styles.signatureImage} />
            )}
            <Text style={styles.label}>Authorized Signature</Text>
            <Text style={styles.value}>{data.applicantName}</Text>
          </View>

          <View
            style={[
              styles.signatureBlock,
              { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
            ]}
          >
            <View
              style={{
                height: 40,
                justifyContent: "flex-end",
                marginBottom: 5,
              }}
            >
              <Text style={styles.value}>
                {data.createdAt ? displayDate(new Date(data.createdAt)) : "N/A"}
              </Text>
            </View>
            <Text style={styles.label}>Date Signed</Text>
          </View>
        </View>
      </View>
    </ApplicationPage>
  </Document>
)
