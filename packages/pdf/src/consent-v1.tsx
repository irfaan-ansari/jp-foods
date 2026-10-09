import React from "react"
import type { ReactNode } from "react"
import { Document, Image, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format, isValid, parseISO } from "@jp/utils/date"
import { ApplicationPage } from "./application-layout"
import { COLORS, styles } from "./styles"

export type ConsentV1Data = {
  name?: string | null
  socialSecurity?: string | null
  signatureUrl?: string | null
  createdAt?: string | Date | null
}

const COMPANY = "Jimenez Produce LLC"

const consentStyles = StyleSheet.create({
  legal: {
    ...styles.legal,
    fontSize: 8.6,
    lineHeight: 1.28,
    marginBottom: 4,
    color: COLORS.secondary,
  },
  sectionTitle: {
    ...styles.sectionTitle,
    fontSize: 10,
    marginTop: 7,
    marginBottom: 4,
  },
  signatureRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 8,
    alignItems: "flex-end",
  },
  signatureBlock: {
    ...styles.signatureBlock,
    minHeight: 42,
  },
  signatureImage: {
    ...styles.signatureImage,
    height: 26,
    marginBottom: 2,
  },
  strong: {
    fontFamily: "Helvetica-Bold",
    color: COLORS.main,
  },
})

function displayDate(value: string | Date | null | undefined) {
  if (!value) return "Not provided"
  const date = typeof value === "string" ? parseISO(value) : value

  return isValid(date) ? format(date, "MMM d, yyyy") : "Not provided"
}

const LegalText = ({ children }: { children: ReactNode }) => (
  <Text style={consentStyles.legal}>{children}</Text>
)

export const ConsentV1PDF = ({ data = {} }: { data?: ConsentV1Data }) => {
  const signedDate = displayDate(data.createdAt)

  return (
    <Document
      title={`Background Consent - ${data.name || "Applicant"}`}
      author="Jimenez Produce"
    >
      <ApplicationPage title="Background consent">
        <View style={styles.header} wrap={false}>
          <Text style={styles.eyebrow}>BACKGROUND CHECK CONSENT</Text>
          <Text style={styles.docTitle}>{data.name || "Applicant"}</Text>
          <Text style={styles.tagline}>
            Disclosure and authorization for consumer reports
          </Text>
          <View style={styles.summary}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Driver name</Text>
              <Text style={styles.value}>{data.name || "Not provided"}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Social Security #</Text>
              <Text style={styles.value}>
                {data.socialSecurity || "Not provided"}
              </Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Date signed</Text>
              <Text style={styles.value}>{signedDate}</Text>
            </View>
          </View>
        </View>

        <Text style={consentStyles.sectionTitle} minPresenceAhead={45}>
          Disclosure Regarding Background Investigation
        </Text>

        <LegalText>
          <Text style={consentStyles.strong}>{COMPANY}</Text>
          {` ("the Company") may obtain information about you from a third party consumer reporting agency for employment purposes. Thus, you may be the subject of a "consumer report" and/or an "investigative consumer report" which may include information about your character, general reputation, personal characteristics, and/or mode of living, and which can involve personal interviews with sources such as your neighbors, friends, or associates.`}
        </LegalText>

        <LegalText>
          These reports may contain information regarding your credit history,
          criminal history, social security verification, motor vehicle records
          ("driving records"), verification of your education or employment
          history, or other background checks. Credit history will only be
          requested where such information is substantially related to the
          duties and responsibilities of the position for which you are
          applying.
        </LegalText>

        <LegalText>
          You have the right, upon written request made within a reasonable
          time, to request whether a consumer report has been run about you, and
          disclosure of the nature and scope of any investigative consumer
          report and to request a copy of your report. Please be advised that
          the nature and scope of the most common form of investigative consumer
          report is an employment history or verification. These searches will
          be conducted by{" "}
          <Text style={consentStyles.strong}>
            Asurint, P.O. Box 14730, Cleveland, OH 44114, 800-906-2034,
            www.asurint.com
          </Text>
          . The scope of this disclosure is all-encompassing, however, allowing
          the Company to obtain from any outside organization all manner of
          consumer reports throughout the course of your employment to the
          extent permitted by law.
        </LegalText>

        <Text style={consentStyles.sectionTitle} minPresenceAhead={45}>
          Acknowledgment and Authorization for Background Check
        </Text>

        <LegalText>
          I acknowledge receipt of the above document entitled DISCLOSURE
          REGARDING BACKGROUND INVESTIGATION and certify that I have read and
          understand both of those documents. I hereby authorize the obtaining
          of "consumer reports" and/or "investigative consumer reports" by{" "}
          {COMPANY} at any time after receipt of this authorization and
          throughout my employment, as allowable by applicable law.
        </LegalText>

        <LegalText>
          To this end, I hereby authorize, without reservation, any law
          enforcement agency, administrator, state or federal agency,
          institution, school or university (public or private), information
          service bureau, employer, or insurance company to furnish any and all
          background information requested by Asurint, P.O. Box 14730,
          Cleveland, OH 44114, 800-906-2034,
          https://www.asurint.com/webdocs/asurint_web_site_privacy.pdf and/or{" "}
          {COMPANY}. I agree that a facsimile ("fax"), electronic or
          photographic copy of this Authorization shall be as valid as the
          original and I agree to receive any notices, relating to my background
          check, electronically.
        </LegalText>

        <View style={consentStyles.signatureRow} wrap={false}>
          <View style={consentStyles.signatureBlock}>
            {data.signatureUrl && (
              <Image
                src={data.signatureUrl}
                style={consentStyles.signatureImage}
              />
            )}
            <Text style={styles.label}>Authorized signature</Text>
            <Text style={styles.value}>{data.name || " "}</Text>
          </View>
          <View style={consentStyles.signatureBlock}>
            <Text style={styles.label}>Date signed</Text>
            <Text style={styles.value}>{signedDate}</Text>
          </View>
        </View>
      </ApplicationPage>
    </Document>
  )
}
