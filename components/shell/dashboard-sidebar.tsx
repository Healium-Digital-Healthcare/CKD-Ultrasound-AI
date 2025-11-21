"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Scan, Calculator, FileText, Menu, Settings, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  isMobileMenuOpen?: boolean
  onMobileMenuClose?: () => void
}

export default function DashboardSidebar({ isMobileMenuOpen = false, onMobileMenuClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(1)

  const navigation = [
    {
      id: 1,
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "My Patients",
      href: "/patients",
      icon: Users,
    },
    {
      id: 3,
      name: "Ultrasound Cases",
      href: "/cases",
      icon: Scan,
    },
    {
      id: 4,
      name: "eGFR Calculator",
      href: "/egfr",
      icon: Calculator,
    },
  ]

  const bottomNavigation = [
    {
      id: 6,
      name: "Profile",
      href: "/profile",
      icon: UserIcon,
    },
    {
      id: 7,
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  useEffect(() => {
    const currentNav = [...navigation, ...bottomNavigation].find((item) => {
      if (item.href === "/") {
        return pathname === "/"
      }
      return pathname.startsWith(item.href)
    })
    if (currentNav) {
      setActiveTab(currentNav.id)
    }
  }, [pathname])

  const handleMenuClick = (id: number) => {
    setActiveTab(id)
    if (onMobileMenuClose) {
      onMobileMenuClose()
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <div className="w-16 fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo Section */}
          <div className="h-20 flex items-center justify-center border-b border-gray-200">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <img src='/logo/logo.svg' className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = item.id === activeTab

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    "flex items-center justify-center h-12 mx-2 rounded-lg transition-all group relative",
                    isActive ? "bg-green-50 text-primary" : "text-gray-400 hover:text-primary hover:bg-gray-50",
                  )}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                  {/* <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.name}
                  </span> */}
                </Link>
              )
            })}
          </nav>

        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={onMobileMenuClose}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-gray-900 font-semibold text-lg">Menu</span>
            </div>

            <nav className="px-4 py-6 space-y-2">
              {[...navigation, ...bottomNavigation].map((item) => {
                const Icon = item.icon
                const isActive = item.id === activeTab

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive ? "bg-blue-50 text-[#687FE5]" : "text-gray-600 hover:text-[#687FE5] hover:bg-gray-50",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
