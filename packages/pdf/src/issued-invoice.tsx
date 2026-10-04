import React from "react"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

export type IssuedInvoiceData = any

const money = (value: string | number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value)
  )
const quantity = (value: string | null) => String(Number(value ?? 0))
const styles = StyleSheet.create({
  page: {
    padding: 36,
    paddingBottom: 52,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#253346",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  title: {
    fontSize: 25,
    fontFamily: "Helvetica-Bold",
    color: "#176052",
    textAlign: "right",
  },
  muted: { color: "#657386", lineHeight: 1.5 },
  label: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#657386",
    marginBottom: 6,
  },
  addresses: { flexDirection: "row", gap: 24, marginBottom: 22 },
  address: { flex: 1, lineHeight: 1.5 },
  meta: {
    flexDirection: "row",
    gap: 20,
    padding: 12,
    backgroundColor: "#f0f5f4",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#dde4e8",
  },
  tableHeader: {
    backgroundColor: "#176052",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  description: { width: "36%", paddingRight: 8 },
  ordered: { width: "12%", textAlign: "right", paddingRight: 7 },
  billed: { width: "15%", textAlign: "right", paddingRight: 7 },
  price: { width: "13%", textAlign: "right", paddingRight: 7 },
  tax: { width: "10%", textAlign: "right", paddingRight: 7 },
  amount: { width: "14%", textAlign: "right" },
  totals: { marginTop: 18, marginLeft: "55%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: "#176052",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginTop: 5,
    paddingTop: 10,
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 36,
    right: 36,
    fontSize: 8,
    color: "#657386",
    flexDirection: "row",
    justifyContent: "space-between",
  },
})

function Address({
  title,
  party,
}: {
  title: string
  party: IssuedInvoiceData["billTo"]
}) {
  return (
    <View style={styles.address}>
      <Text style={styles.label}>{title}</Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>{party?.name ?? ""}</Text>
      <Text>{party?.street ?? ""}</Text>
      <Text>
        {[party?.city, party?.state, party?.zip].filter(Boolean).join(" ")}
      </Text>
      {party?.email && <Text>{party.email}</Text>}
      {party?.phone && <Text>{party.phone}</Text>}
    </View>
  )
}

/** Renders only persisted invoice snapshots, never live products or customers. */
export function IssuedInvoice({ data }: { data: IssuedInvoiceData }) {
  return (
    <Document title={`Invoice ${data.number}`} author={data.billFrom?.name}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={{ width: "58%" }}>
            <Text style={styles.name}>{data.billFrom?.name ?? ""}</Text>
            <Text style={styles.muted}>{data.billFrom?.street ?? ""}</Text>
            <Text style={styles.muted}>
              {[data.billFrom?.city, data.billFrom?.state, data.billFrom?.zip]
                .filter(Boolean)
                .join(" ")}
            </Text>
            <Text style={styles.muted}>
              {[data.billFrom?.email, data.billFrom?.phone]
                .filter(Boolean)
                .join(" | ")}
            </Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={{ textAlign: "right", marginTop: 7 }}>
              {data.number}
            </Text>
          </View>
        </View>
        <View style={styles.meta} wrap={false}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>ISSUED (UTC)</Text>
            <Text>{new Date(data.createdAt).toISOString().slice(0, 10)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>ORDER</Text>
            <Text>#{data.orderId}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>PURCHASE ORDER</Text>
            <Text>{data.po || "-"}</Text>
          </View>
          {data.dueDate && (
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>DUE</Text>
              <Text>{data.dueDate}</Text>
            </View>
          )}
        </View>
        <View style={styles.addresses} wrap={false}>
          <Address title="BILL TO" party={data.billTo} />
          <Address title="SHIP TO" party={data.shipTo} />
        </View>
        <View style={[styles.row, styles.tableHeader]} fixed>
          <Text style={styles.description}>ITEM / DESCRIPTION</Text>
          <Text style={styles.ordered}>ORDERED</Text>
          <Text style={styles.billed}>BILLED QTY</Text>
          <Text style={styles.price}>RATE</Text>
          <Text style={styles.tax}>TAX</Text>
          <Text style={styles.amount}>AMOUNT</Text>
        </View>
        {data.lineItems.map((item) => (
          <View key={item.id} style={styles.row} wrap={false}>
            <View style={styles.description}>
              <Text>{item.title}</Text>
              <Text style={[styles.muted, { fontSize: 8 }]}>
                {[item.itemCode, item.unitName].filter(Boolean).join(" / ")}
              </Text>
            </View>
            <Text style={styles.ordered}>{quantity(item.quantity)}</Text>
            <Text style={styles.billed}>
              {quantity(item.catchWeight ? item.unitQuantity : item.quantity)}
              {item.catchWeight && item.uom ? ` ${item.uom}` : ""}
            </Text>
            <Text style={styles.price}>{money(item.price)}</Text>
            <Text style={styles.tax}>{money(item.taxAmount)}</Text>
            <Text style={styles.amount}>{money(item.subtotal)}</Text>
          </View>
        ))}
        <View style={styles.totals} wrap={false}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{money(data.subtotal)}</Text>
          </View>
          {Number(data.discount) !== 0 && (
            <View style={styles.totalRow}>
              <Text>Discount</Text>
              <Text>-{money(data.discount)}</Text>
            </View>
          )}
          {(data.charges ?? []).map((charge, index) => (
            <View key={index} style={styles.totalRow}>
              <Text>{charge.type}</Text>
              <Text>{money(charge.amount)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text>{data.tax?.type || "Tax"}</Text>
            <Text>{money(data.taxTotal)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Invoice total</Text>
            <Text>{money(data.total)}</Text>
          </View>
        </View>
        {data.paymentTerms && (
          <Text style={{ marginTop: 18 }}>
            Payment terms: {data.paymentTerms}
          </Text>
        )}
        {data.notes && (
          <Text style={{ marginTop: 12, lineHeight: 1.5 }}>{data.notes}</Text>
        )}
        <View style={styles.footer} fixed>
          <Text>
            {data.number} | Order #{data.orderId}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
