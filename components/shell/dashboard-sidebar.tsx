"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Scan, Settings, FileTextIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CreateStudySheet } from "@/components/cases/create-study-sheet"

interface DashboardSidebarProps {
  isMobileMenuOpen?: boolean
  onMobileMenuClose?: () => void
}

export default function DashboardSidebar({ isMobileMenuOpen = false, onMobileMenuClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(1)
  const [createStudyOpen, setCreateStudyOpen] = useState(false)

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

  const bottomNavigation = [
    {
      id: 7,
      name: "Settings",
      href: "/settings/organization",
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
        <div className="w-64 fixed inset-y-0 left-0 bg-background/80 border-r border-border/40 flex flex-col">
          {/* Logo Section */}
          <div className="h-20 px-5 flex items-center border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src="/logo/logo.svg" className="h-10 w-10" alt="Healium CDK Logo" />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-semibold text-base leading-none mb-1">Healium CDK</span>
                <span className="text-muted-foreground text-[11px] font-medium tracking-wide leading-none">
                  HEALIUM INTELLISCAN
                </span>
              </div>
            </div>
          </div>

          {/* New Study Button */}
          {/* <div className="px-4 pt-5 pb-3">
            <Button
              className="w-full h-11 font-medium shadow-sm hover:shadow-md transition-all"
              onClick={() => setCreateStudyOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Study
            </Button>
          </div> */}

          {/* Main Navigation */}
          <div className="flex-1 py-4 overflow-y-auto">
            <div className="px-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
                Clinical
              </p>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activeTab
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-medium group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/70 hover:text-foreground hover:bg-accent/50",
                      )}
                    >
                      <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "" : "")} />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-auto px-3 pt-4 border-t border-border/40">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
                System
              </p>
              <nav className="space-y-0.5">
                {bottomNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activeTab
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-medium group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/70 hover:text-foreground hover:bg-accent/50",
                      )}
                    >
                      <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "" : "")} />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onMobileMenuClose}>
          <div
            className="fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-border/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Logo Section */}
            <div className="px-5 h-20 flex items-center border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src="/logo/logo.svg" className="h-10 w-10" alt="Healium CDK Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-base leading-none mb-1">Healium CDK</span>
                  <span className="text-muted-foreground text-[11px] font-medium tracking-wide leading-none">
                    INTELLISCAN
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Main Navigation */}
            <div className="py-4">
              <div className="px-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
                  Clinical
                </p>
                <nav className="space-y-0.5">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activeTab
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => handleMenuClick(item.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-medium group",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/70 hover:text-foreground hover:bg-accent/50",
                        )}
                      >
                        <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "" : "")} />
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="mt-6 px-3 pt-4 border-t border-border/40">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
                  System
                </p>
                <nav className="space-y-0.5">
                  {bottomNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activeTab
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => handleMenuClick(item.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-medium group",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/70 hover:text-foreground hover:bg-accent/50",
                        )}
                      >
                        <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "" : "")} />
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Study Sheet Component */}
      <CreateStudySheet open={createStudyOpen} onOpenChange={setCreateStudyOpen} />
    </>
  )
}
