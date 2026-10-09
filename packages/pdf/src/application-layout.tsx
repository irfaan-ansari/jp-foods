import React from "react"
import type { ReactNode } from "react"
import { Page, Text, View } from "@react-pdf/renderer"
import { styles } from "./styles"

export function ApplicationPage({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <Page size="LETTER" style={[styles.page, { paddingBottom: 36 }]}>
      <Text style={styles.runningBrand} fixed>
        JIMENEZ PRODUCE
      </Text>
      <Text style={styles.runningTitle} fixed>
        {title.toUpperCase()}
      </Text>
      {children}
      <View wrap={false} style={{ marginTop: "auto", paddingTop: 24 }}>
        <View style={styles.applicationFooterAddresses}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerHeading}>Alabama</Text>
            <Text>+1 (251) 262-2607</Text>
            <Text>jorge@jimenezproduce.com</Text>
            <Text>23141 Rubens Ln</Text>
            <Text>Robertsdale, AL 36567</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerHeading}>Louisiana</Text>
            <Text>+1 (337) 806-9008</Text>
            <Text>yhessenia@jimenezproduce.com</Text>
            <Text>100 Goldenrod Dr</Text>
            <Text>Lafayette, LA 70507</Text>
          </View>
        </View>
        <Text style={{ marginTop: 8, fontSize: 6, color: "#676767" }}>
          CONFIDENTIAL / {title}
        </Text>
      </View>
    </Page>
  )
}
