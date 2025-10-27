"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Scan, Calculator, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
    // {
    //   id: 4,
    //   name: "Ultrasound Video",
    //   href: "/upload",
    //   icon: Video,
    // },
    {
      id: 5,
      name: "eGFR Calculator",
      href: "/egfr",
      icon: Calculator,
    },
  ]

  useEffect(() => {
    // Set active tab based on current pathname
    const currentNav = navigation.find((item) => {
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
      <div className="hidden md:block min-h-screen">
        <div className="w-64 fixed inset-y-0 border-r border-[#1f2937] bg-black">
          <div className="flex flex-col h-full pt-20">
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = item.id === activeTab

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-gray-400 hover:text-primary hover:bg-primary/20",
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
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80" onClick={onMobileMenuClose}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-black border-r border-[#1f2937] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#1f2937]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#009A6B] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <span className="text-white font-semibold text-lg">KidneyAI</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = item.id === activeTab

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#009A6B] text-white shadow-lg shadow-[#009A6B]/20"
                        : "text-gray-400 hover:text-white hover:bg-[#1f2937]",
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