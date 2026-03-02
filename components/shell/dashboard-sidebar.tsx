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
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(1)
  const [createStudyOpen, setCreateStudyOpen] = useState(false)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("Today's")

  // Build href with preserved search params
  const buildHref = (basePath: string) => {
    const q = searchParams.get("q")
    const type = searchParams.get("type")
    if (q) {
      const params = new URLSearchParams()
      params.set("q", q)
      if (type) params.set("type", type)
      return `${basePath}?${params.toString()}`
    }
    return basePath
  }

  const navigation = [
    {
      id: 1,
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      id: 3,
      name: "Study List",
      href: "/cases",
      icon: Scan,
    },
    {
      id: 4,
      name: "Reports",
      href: "/reports",
      icon: FileTextIcon,
    },
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

  const handleMenuClick = (id: number) => {
    setActiveTab(id)
  }

  const insights = [
    {
      id: 1,
      label: "High-risk",
      value: "2 patient",
      icon: AlertCircle,
      color: "text-destructive",
      dotColor: "bg-destructive",
    },
    {
      id: 2,
      label: "Average eGFR",
      value: "71 mL/min/1.73m²",
      icon: BarChart3,
      color: "text-primary",
      dotColor: "bg-primary",
    },
    {
      id: 3,
      label: "Follow-ups needed",
      value: "4 patients",
      icon: Clock,
      color: "text-warning",
      dotColor: "bg-warning",
    },
    {
      id: 4,
      label: "Most common stage",
      value: "Stage 1-3",
      icon: CheckCircle2,
      color: "text-purple-600",
      dotColor: "bg-purple-600",
    },
  ]

  const filterOptions = ["All", "Today's", "This week", "This month"]

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <div className="w-64 fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border flex flex-col">
          {/* Logo Section */}
          <div className="h-20 px-5 flex items-center border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white">
                <img src="/logo/logo.svg" className="h-10 w-10" alt="Healium CDK Logo" />
              </div>
              <div className="flex flex-col">
                <span className="text-sidebar-foreground font-semibold text-base leading-none mb-1">Healium CDK</span>
                <span className="text-sidebar-foreground/60 text-[11px] font-medium tracking-wide leading-none">
                  HEALIUM INTELLISCAN
                </span>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3">
              <p className="text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-widest mb-3 px-3">
                Clinical
              </p>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activeTab
                  return (
                    <Link
                      key={item.id}
                      href={buildHref(item.href)}
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-medium",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                          : "text-primary hover:bg-sidebar-accent",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Today's Insights Section */}
            <div className="px-3 mt-6">
              <p className="text-[12px] font-semibold text-destructive mb-3 px-3">Today&apos;s Insights</p>
              <div className="bg-white rounded-lg p-3 space-y-3 border border-sidebar-border">
                {insights.map((insight) => {
                  const Icon = insight.icon
                  return (
                    <div key={insight.id} className="flex items-start gap-2">
                      <div className={cn("mt-0.5 p-1 rounded", insight.dotColor)}>
                        <Icon className={cn("h-3 w-3", insight.color === "text-destructive" ? "text-white" : insight.color === "text-warning" ? "text-white" : "text-white")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground/70">{insight.label}</p>
                        <p className="text-[11px] font-semibold text-foreground">{insight.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filter Section */}
            <div className="px-3 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-medium text-destructive">Filter:</span>
                <div className="relative">
                  <button
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="text-[12px] px-2 py-1 border border-cyan-200 rounded bg-white text-foreground hover:bg-cyan-50 flex items-center gap-1"
                  >
                    {selectedFilter}
                    <span className="text-[8px]">▼</span>
                  </button>
                  {filterDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-cyan-200 rounded shadow-md z-50">
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedFilter(option)
                            setFilterDropdownOpen(false)
                          }}
                          className={cn(
                            "block w-full text-left px-3 py-2 text-[12px] hover:bg-cyan-50",
                            selectedFilter === option ? "font-semibold" : ""
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 border-primary text-primary hover:bg-blue-50">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary">
              <Plus className="h-4 w-4" />
              New Screening
            </Button>
          </div>
        </div>
      </div>

      {/* Create Study Sheet Component */}
      <CreateStudySheet open={createStudyOpen} onOpenChange={setCreateStudyOpen} />
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
