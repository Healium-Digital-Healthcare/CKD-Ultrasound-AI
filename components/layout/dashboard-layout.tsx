"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import DashboardSidebar from "../shell/dashboard-sidebar"
import DashboardHeader from "../shell/dashboard-header"

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
    // You can add search logic here or pass it to children via context
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen bg-black">
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
        <main className="flex-1 overflow-auto bg-black pt-20 ml-64">{children}</main>
      </div>
    </div>
  )
}
