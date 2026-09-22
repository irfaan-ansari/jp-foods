import "@jp/ui/globals.css"

import { type Metadata } from "next"
import { cn } from "@jp/ui/lib/utils"

import { Plus_Jakarta_Sans, Lora, Manrope } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import { Provider } from "@/components/provider"

import { SidebarInset, SidebarProvider } from "@jp/ui/components/sidebar"
import { getSession, listDeviceSessions } from "@/features/auth"

// const loraHeading = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-heading",
// })
// const manrope = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })

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
  const sessionsList = await listDeviceSessions()
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "font-sans",
        "bg-neutral-100",
        manrope.variable,
        loraHeading.variable
      )}
    >
      <body>
        <Provider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "304px",
              } as React.CSSProperties
            }
          >
            <AppSidebar session={session!} sessionsList={sessionsList} />
            <SidebarInset className="@container/page-content no-scrollbar md:h-[calc(100svh-16px)] md:overflow-auto">
              {/* render status */}
              {/* <NetworkStatus /> */}
              {children}
            </SidebarInset>
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  )
}
