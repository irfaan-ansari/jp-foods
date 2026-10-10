import { format } from "@jp/utils/date"
import { formatPhone, formatUSD } from "@jp/utils"
import { env } from "@jp/utils/env"
import type { OrganizationSelectType, ProductSelectType } from "@jp/db"
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer"

const colors = {
  green: "#13360c",
  accent: "#80b83a",
  ink: "#202620",
  muted: "#647268",
  cream: "#F8FAF7",
  line: "#E5E9E2",
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.ink,
    lineHeight: 1.35,
    paddingTop: 36,
    paddingHorizontal: 30,
    paddingBottom: 34,
  },
  runningHeader: {
    position: "absolute",
    top: 18,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    fontSize: 7,
    color: colors.muted,
  },
  hero: {
    borderTopWidth: 3,
    borderTopColor: colors.accent,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  brandRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logo: {
    width: 54,
    height: 54,
    objectFit: "contain",
  },
  heroCopy: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: colors.green,
    lineHeight: 1.1,
  },
  subtitle: { fontSize: 10, color: colors.muted, marginTop: 6 },
  details: {
    width: 190,
    flexShrink: 0,
    flexDirection: "column",
    gap: 9,
    textAlign: "right",
  },
  detailColumn: { minWidth: 0 },
  label: {
    fontSize: 7,
    letterSpacing: 1,
    color: colors.green,
    marginBottom: 4,
  },
  value: { fontSize: 10, fontFamily: "Helvetica-Bold", color: colors.green },
  contact: { fontSize: 8, color: colors.muted, marginTop: 3 },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.green,
    letterSpacing: 1,
    marginBottom: 8,
  },
  featuredGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  featuredCard: {
    width: 178.66,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
    backgroundColor: colors.cream,
    padding: 12,
  },
  featuredImage: {
    width: 52,
    height: 52,
    objectFit: "contain",
    alignSelf: "center",
    marginBottom: 8,
  },
  featuredTitle: { fontSize: 9, marginBottom: 6 },
  featuredPrice: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.green,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 9,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  categoryTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: colors.green,
    flex: 1,
  },
  categoryCount: { fontSize: 7, color: colors.muted, marginLeft: 10 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  cell: {
    width: "50%",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "flex-start",
  },
  productTitle: { flex: 1, minWidth: 0, fontSize: 8.5, paddingRight: 8 },
  price: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: colors.green,
    textAlign: "right",
    maxWidth: "42%",
  },
  unit: { fontFamily: "Helvetica", fontSize: 7, color: colors.muted },
  promise: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 14,
    paddingHorizontal: 10,
    marginTop: 8,
    flexDirection: "row",
    gap: 14,
  },
  promiseColumn: { flex: 1, minWidth: 0 },
  promiseTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.green,
    marginBottom: 3,
  },
  promiseText: { fontSize: 7, color: colors.muted },
  footer: {
    position: "absolute",
    top: 756,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: colors.muted,
  },
})

interface CatalogProps {
  org: OrganizationSelectType
  products: Record<string, ProductSelectType[]>
  effectiveFrom: string | Date
  effectiveTo: string | Date
  featured: ProductSelectType[]
}

const ProductPrice = ({ product }: { product: ProductSelectType }) => (
  <Text style={styles.price}>
    {formatUSD(product.price ?? 0)}
    {product.pricingBasis !== "fixed" && (
      <Text style={styles.unit}>{` / ${product.stockUOM}`}</Text>
    )}
  </Text>
)

export const CatalogPDF = ({
  org,
  products,
  effectiveFrom,
  effectiveTo,
  featured,
}: CatalogProps) => {
  const dateRange = `${format(effectiveFrom, "MMM dd, yyyy")} - ${format(effectiveTo, "MMM dd, yyyy")}`

  return (
    <Document
      title={`Jimenez Produce - ${org.name} Weekly Price List`}
      author="Jimenez Produce"
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.runningHeader}>
          <Text>JIMENEZ PRODUCE / WEEKLY PRICE LIST</Text>
          <Text>WEEK OF {dateRange}</Text>
        </View>
        <View style={styles.hero} wrap={false}>
          <View style={styles.brandRow}>
            <Image
              src={`${env.NEXT_PUBLIC_PUBLIC_URL}/logo.png`}
              style={styles.logo}
            />
            <View style={styles.heroCopy}>
              <Text style={styles.title}>Jimenez Produce</Text>
              <Text style={styles.subtitle}>WEEKLY PRICE LIST</Text>
            </View>
          </View>
          <View style={styles.details}>
            <View style={styles.detailColumn}>
              <Text style={styles.value}>{org.name}</Text>
              <Text style={styles.contact}>{formatPhone(org.phoneNumber)}</Text>
              <Text style={styles.contact}>{org.email}</Text>
            </View>
          </View>
        </View>
        {featured?.length > 0 && (
          <View>
            <Text style={styles.sectionLabel} minPresenceAhead={130}>
              THIS WEEK'S HIGHLIGHTS
            </Text>
            <View style={styles.featuredGrid}>
              {featured.map((product) => (
                <View key={product.id} style={styles.featuredCard} wrap={false}>
                  {product.image && (
                    <Image src={product.image} style={styles.featuredImage} />
                  )}
                  <Text style={styles.featuredTitle}>{product.title}</Text>
                  <ProductPrice product={product} />
                </View>
              ))}
            </View>
          </View>
        )}
        {/* Preserve category insertion order and the existing row-major product order. */}
        {Object.entries(products).flatMap(([category, categoryProducts]) => {
          const rows: ProductSelectType[][] = []
          for (let index = 0; index < categoryProducts.length; index += 2) {
            rows.push(categoryProducts.slice(index, index + 2))
          }
          const renderRow = (row: ProductSelectType[], rowIndex: number) => (
            <View
              key={`${category}-row-${rowIndex}`}
              style={[
                styles.row,
                {
                  backgroundColor:
                    rowIndex % 2 === 0 ? "#FFFFFF" : colors.cream,
                },
              ]}
              wrap={false}
            >
              {row.map((product, columnIndex) => (
                <View
                  key={product.id}
                  style={[
                    styles.cell,
                    columnIndex === 0
                      ? { paddingRight: 16 }
                      : { paddingLeft: 16 },
                  ]}
                >
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <ProductPrice product={product} />
                </View>
              ))}
            </View>
          )
          // Only keep the heading and first row together. The remaining rows
          // are direct page children so a large category can start on page one.
          return [
            <View key={`${category}-start`} wrap={false}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>
                  {categoryProducts.length} ITEMS
                </Text>
              </View>
              {rows[0] && renderRow(rows[0], 0)}
            </View>,
            ...rows.slice(1).map((row, index) => renderRow(row, index + 1)),
            <View key={`${category}-spacing`} style={{ height: 20 }} />,
          ]
        })}
        <View style={styles.promise} wrap={false}>
          {[
            ["Fresh Quality", "Hand selected produce"],
            ["Great Prices", "Competitive prices every week"],
            ["Reliable Delivery", "On time delivery you can count on"],
          ].map(([title, description]) => (
            <View key={title} style={styles.promiseColumn}>
              <Text style={styles.promiseTitle}>{title}</Text>
              <Text style={styles.promiseText}>{description}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer} fixed>
          <Text>Jimenez Produce</Text>
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
