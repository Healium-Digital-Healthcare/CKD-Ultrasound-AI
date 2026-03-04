"use client"

import { useState, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Scan, Settings, FileTextIcon, Plus, RefreshCw, AlertCircle, BarChart3, CheckCircle2, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"
import { Button } from "@/components/ui/button"

function DashboardSidebarContent() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(1)

  const navigation = [
    { id: 1, href: "/dashboard", icon: LayoutDashboard },
    { id: 2, href: "/patients", icon: Users },
    { id: 3, href: "/cases", icon: Scan },
    { id: 4, href: "/reports", icon: FileTextIcon },
  ]

  useEffect(() => {
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

  return (
    <>
      {/* Desktop Sidebar - Icon Only */}
      <div className="hidden md:block">
        <div className="w-20 fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center h-10 w-10 rounded-lg">
            <img src="/logo/logo.svg" className="h-8 w-8" alt="Logo" />
          </div>

          {/* Navigation Icons */}
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = item.id === activeTab
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                  title={`Nav ${item.id}`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Icons */}
          <nav className="flex flex-col gap-4 pb-4">
            <button className="flex items-center justify-center h-10 w-10 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-all">
              <Settings className="h-5 w-5" />
            </button>
            <div className="h-10 w-10 rounded-lg bg-gray-400 flex items-center justify-center text-sidebar-foreground text-xs font-bold">
              U
            </div>
          </nav>
        </div>
      </div>

      {/* Create Study Sheet Component */}
      <CreateStudySheet open={false} onOpenChange={() => {}} />
    </>
  )

  
}

export default function DashboardSidebar() {
  return (
    <Suspense fallback={
      <div className="hidden md:block">
        <div className="w-64 fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="h-20 px-5 flex items-center border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-sidebar-accent/50 animate-pulse" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-sidebar-accent/50 rounded animate-pulse" />
                <div className="h-3 w-32 bg-sidebar-accent/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex-1 py-4 px-3">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-sidebar-accent/50 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="mt-6 px-3">
              <div className="h-4 w-20 bg-sidebar-accent/50 rounded animate-pulse mb-3" />
              <div className="bg-white rounded-lg p-3 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-sidebar-accent/30 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
            <div className="h-9 bg-sidebar-accent/50 rounded animate-pulse" />
            <div className="h-9 bg-sidebar-accent/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    }>
      <DashboardSidebarContent />
    </Suspense>
  )
}
