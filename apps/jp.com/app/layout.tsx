import "./styles.css"
import { type Metadata } from "next"
import { cn } from "@jp/ui/lib/utils"
import { SITE_CONFIG } from "@/lib/config"
import { Manrope, Bricolage_Grotesque } from "next/font/google"
import { SiteProvider } from "@/components/site-provider"

const loraHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
})

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Reliable Foodservice Distribution Across the Gulf Coast"`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Trusted foodservice distributor delivering fresh produce and essential supplies to restaurants and commercial kitchens across the Gulf Coast",
  openGraph: {
    title: `${SITE_CONFIG.name}`,
    description:
      "Trusted foodservice distributor delivering fresh produce and essential supplies to restaurants and commercial kitchens across the Gulf Coast",
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${SITE_CONFIG.name}`,
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        manrope.variable,
        loraHeading.variable
      )}
    >
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  )
}
