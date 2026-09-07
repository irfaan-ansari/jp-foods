import "./styles.css"

import { type Metadata } from "next"
import { cn } from "@jp/ui/lib/utils"

import { Manrope, Lora } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import { Provider } from "@/components/provider"

import { SidebarInset, SidebarProvider } from "@jp/ui/components/sidebar"
import { getSession } from "@/features/auth/auth.data"
import { redirect } from "next/navigation"

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })

const SITE_CONFIG = { name: "Jimenez Produce" }

export const metadata: Metadata = {
  title: {
    default: `Dashboard | ${SITE_CONFIG.name}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  if (!session) redirect("localhost:3000")
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
        <Provider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "16rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar session={{ ...session }} />
            <SidebarInset className="@container/page-content no-scrollbar md:h-[calc(100svh-16px)] md:overflow-auto md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  )
}
