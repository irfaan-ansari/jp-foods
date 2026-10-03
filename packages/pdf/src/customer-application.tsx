import { format, isValid, parseISO } from "date-fns"
import type { CustomerApplicationSelectType } from "@jp/db"
import { ApplicationPage } from "./application-layout"
import { COLORS, styles } from "./styles"

import { Document, Text, View, Image } from "@react-pdf/renderer"

function displayDate(value: Date | string | null | undefined) {
  if (!value) return "Not provided"
  const date = typeof value === "string" ? parseISO(value) : value
  return isValid(date) ? format(date, "MMM d, yyyy") : "Not provided"
}

export const CustomerApplicationPDF = ({
  data,
}: {
  data: CustomerApplicationSelectType
}) => {
  return (
    <Document
      title={`Customer Application - ${data.companyName}`}
      author="Jimenez Produce"
    >
      <ApplicationPage title="Customer application">
        <View style={styles.header} wrap={false}>
          <Text style={styles.eyebrow}>CUSTOMER APPLICATION</Text>
          <Text style={styles.docTitle}>{data.companyName}</Text>
          <Text style={styles.tagline}>{data.companyType}</Text>
          <View style={styles.summary}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Application reference</Text>
              <Text
                style={styles.value}
              >{`CUST-${String(data.id).padStart(6, "0")}`}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Submitted</Text>
              <Text style={styles.value}>{displayDate(data.createdAt)}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { textTransform: "capitalize" }]}>
                {data.status.replaceAll("_", " ")}
              </Text>
            </View>
          </View>
        </View>
        {/* 2. BUSINESS IDENTITY */}
        <Text style={styles.sectionTitle} minPresenceAhead={45}>
          Business Identity
        </Text>
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Legal Company Name</Text>
            <Text style={[styles.value, { fontSize: 12 }]}>
              {data.companyName}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Application Status</Text>
            <Text style={[styles.value, { textTransform: "capitalize" }]}>
              {data.status.replaceAll("_", " ")}
            </Text>
          </View>
        </View>

        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Doing Business As (DBA)</Text>
            <Text style={styles.value}>{data.companyDBA || "N/A"}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Company Type</Text>
            <Text style={styles.value}>{data.companyType}</Text>
          </View>
        </View>

        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EIN / Tax ID</Text>
            <Text style={styles.value}>{data.companyEin}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Details</Text>
            <Text style={styles.value}>
              {data.companyEmail} | {data.companyPhone}
            </Text>
          </View>
        </View>
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {data.companyStreet}, {data.companyCity}, {data.companyState}{" "}
              {data.companyZip}
            </Text>
          </View>
        </View>

        {/* 3. AUTHORIZED OFFICER */}
        <Text style={styles.sectionTitle} minPresenceAhead={45}>
          Authorized Officer
        </Text>
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>
              {data.officerFirst} {data.officerLast}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contact Details</Text>
            <Text style={styles.value}>
              {data.officerEmail} | {data.officerMobile}
            </Text>
          </View>
        </View>

        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{data.officerRole}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>
              {data.officerStreet}, {data.officerCity}, {data.officerState}{" "}
              {data.officerZip}
            </Text>
          </View>
        </View>
        {/* 4. BILLING & OPERATIONS */}
        <Text style={styles.sectionTitle} minPresenceAhead={45}>
          Operations & Billing
        </Text>
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Guarantor</Text>
            <Text style={styles.value}>
              {data.guarantorName || "Not Provided"}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Guarantor Title</Text>
            <Text style={styles.value}>
              {data.guarantorRole || "Not Provided"}
            </Text>
          </View>
        </View>
        <View style={styles.row} wrap={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Accounts Payable Email</Text>
            <Text style={styles.value}>
              {data.accountPayableEmail || "Not Provided"}
            </Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ordering Contact</Text>
            <Text style={styles.value}>
              {data.orderingName} ({data.orderingPhone})
            </Text>
          </View>
        </View>
        {/* 4. DELIVERY SCHEDULE */}
        <Text style={styles.sectionTitle} minPresenceAhead={45}>
          Delivery Requirements
        </Text>
        <Text
          style={[
            styles.label,
            { textTransform: "uppercase", marginBottom: 10 },
          ]}
        >
          Lockbox: {data.lockboxPermission}
        </Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F5F5F5",
            padding: 7,
          }}
        >
          <Text
            style={{
              width: "25%",
              fontSize: 7,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            Day/Window
          </Text>
          <Text
            style={{
              width: "30%",
              fontSize: 7,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            Receiver
          </Text>
          <Text
            style={{
              width: "45%",
              fontSize: 7,
              fontWeight: "bold",
              color: COLORS.secondary,
            }}
          >
            Instructions
          </Text>
        </View>

        {!data.deliverySchedule?.length && (
          <Text style={[styles.legal, { marginTop: 6 }]}>
            No delivery schedule provided.
          </Text>
        )}
        {(data.deliverySchedule ?? []).map((sch, i) => (
          <View
            key={i}
            wrap={false}
            style={{
              flexDirection: "row",
              padding: 7,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.divider,
            }}
          >
            <Text style={{ width: "25%", fontSize: 8 }}>
              {sch.day} ({sch.window})
            </Text>
            <View style={{ width: "30%", fontSize: 8 }}>
              <Text>{sch.receivingName}</Text>
              <Text>{sch.receivingPhone}</Text>
            </View>
            <Text
              style={{ width: "45%", fontSize: 8, color: COLORS.secondary }}
            >
              {sch.instructions || "Standard"}
            </Text>
          </View>
        ))}
        <View wrap={false}>
          <Text style={styles.sectionTitle} minPresenceAhead={45}>
            Acknowledgement
          </Text>
          <View>
            <Text style={styles.legal}>
              By submitting this application, I certify that I am the individual
              personally responsible for all payments to Jimenez Produce LLC
              (“the Company”). I understand that no credit will be extended to
              my company unless I personally guarantee all amounts owed. I
              hereby unconditionally and irrevocably guarantee the full and
              prompt payment of any and all amounts due to Jimenez Produce LLC,
              including invoices, service charges, interest, fees, and any other
              obligations incurred by my company, whether existing now or
              arising in the future.
            </Text>

            <Text style={styles.legal}>
              This personal guarantee is a continuing guarantee and remains in
              full force and effect until all balances are paid in full. I
              understand that I may terminate this guarantee only by providing
              written notice via certified mail, return receipt requested, to:
              Jimenez Produce LLC, 23141 Rubens Ln, Robertsdale, AL 36567.
              Termination will apply only to new transactions occurring after
              Jimenez Produce LLC receives and acknowledges my notice, and does
              not release me from responsibility for any amounts incurred prior
              to termination.
            </Text>

            <Text style={styles.legal}>
              In the event of nonpayment or default, I agree to be personally
              liable for all outstanding balances, accrued interest, returned
              check fees, service charges, and all reasonable costs of
              collection, including attorney’s fees, court costs, and
              third-party collection fees. Jimenez Produce LLC may enforce this
              agreement in any jurisdiction where I or my assets are located,
              including but not limited to Alabama, Louisiana, Mississippi,
              Florida, and Georgia.
            </Text>

            <Text style={styles.legal}>
              I waive any requirement that Jimenez Produce LLC first pursue my
              company or any other party before enforcing this guarantee, and I
              waive any right to receive notice of default, nonpayment,
              extensions of credit, or any other notices relating to the
              guaranteed debt.
            </Text>

            <Text style={styles.legal}>
              By submitting this application, I affirm that I have read,
              understand, and agree to this Personal Guarantee Agreement, and
              that my electronic submission serves as my voluntary and legally
              binding signature under applicable state and federal law.
            </Text>
          </View>

          <View wrap={false} style={[styles.row, { marginTop: 12 }]}>
            <View style={styles.signatureBlock}>
              {data.signatureUrl && (
                <Image src={data.signatureUrl} style={styles.signatureImage} />
              )}
              <Text style={styles.label}>Authorized Signature</Text>
              <Text style={styles.value}>{data.signatureName}</Text>
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
                  {data.createdAt ? displayDate(data.createdAt) : "N/A"}
                </Text>
              </View>
              <Text style={styles.label}>Date Signed</Text>
            </View>
          </View>
        </View>
      </ApplicationPage>
    </Document>
  )
}

export const CustomerPDF = CustomerApplicationPDF
