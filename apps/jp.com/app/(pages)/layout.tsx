import React from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="site relative">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
