"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import DashboardSidebar from "../shell/dashboard-sidebar"
import DashboardHeader from "../shell/dashboard-header"
import { Provider } from "react-redux"
import { store } from "@/store/app-store"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Cases", href: "/cases" },
  { name: "My Patients", href: "/patients" },
  { name: "Ultrasound Screening", href: "/cases" },
  { name: "Ultrasound Video", href: "/upload" },
  { name: "eGFR Calculator", href: "/egfr" },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const getPageTitle = () => {
    const route = navigation.find((item) => item.href === pathname || pathname?.startsWith(item.href + "/"))
    return route?.name || "Dashboard"
  }

  const handleSearch = (text: string) => {
    setSearchText(text)
    console.log(searchText)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <Provider store={store}>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Sidebar */}
        <DashboardSidebar isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMobileMenuClose} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            headerTitle={getPageTitle()}
            onSearch={handleSearch}
            onMobileMenuToggle={handleMobileMenuToggle}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-auto ml-64 bg-gradient-to-br from-background via-background to-muted/20">
            {children}
          </main>
        </div>
      </div>
    </Provider>
  )
}
