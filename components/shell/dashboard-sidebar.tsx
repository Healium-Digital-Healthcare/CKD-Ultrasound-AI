"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Scan, Calculator, UserIcon, Settings, FileTextIcon } from "lucide-react"
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
      name: "Patients",
      href: "/patients",
      icon: Users,
      badge: "234",
    },
    {
      id: 3,
      name: "Study List",
      href: "/cases",
      icon: Scan,
    },
    {
      id: 4,
      name: "Report",
      href: "/reports",
      icon: FileTextIcon,
    },
  ]

  const bottomNavigation = [
    {
      id: 7,
      name: "Organization Settings",
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
        <div className="w-64 fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border flex flex-col shadow-premium">
          {/* Logo Section */}
          <div className="h-20 px-6 py-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <img src="/logo/logo.svg" className="h-10 w-10" alt="Logo" />
              </div>
              <div className="flex flex-col">
                <span className="text-sidebar-foreground font-semibold text-base tracking-tight">Healium CDK</span>
                <span className="text-muted-foreground text-xs font-medium">Healium Intelliscan</span>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 py-6 overflow-y-auto">
            <div className="px-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                CLINICAL
              </p>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activeTab
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-premium text-sm font-medium group relative",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent hover:translate-x-0.5",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-premium",
                          isActive ? "" : "group-hover:scale-110",
                        )}
                      />
                      <span className="flex-1">{item.name}</span>
                      
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-auto px-4 mt-6 pt-6 border-t border-sidebar-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                ADMINISTRATION
              </p>
              
              <nav className="space-y-1">
                {bottomNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activeTab
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleMenuClick(item.id)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-premium text-sm font-medium group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent hover:translate-x-0.5",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-premium",
                          isActive ? "" : "group-hover:scale-110",
                        )}
                      />
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
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onMobileMenuClose}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border shadow-premium-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Logo Section */}
            <div className="px-6 py-6 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                  <img src="/logo/logo.svg" className="h-6 w-6" alt="Logo" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sidebar-foreground font-semibold text-base tracking-tight">MediCare Pro</span>
                  <span className="text-muted-foreground text-xs font-medium">Healthcare System</span>
                </div>
              </div>
            </div>

            {/* Mobile Main Navigation */}
            <div className="py-6">
              <div className="px-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  Main Menu
                </p>
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activeTab
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => handleMenuClick(item.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-premium text-sm font-medium group relative",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent hover:translate-x-0.5",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-premium",
                            isActive ? "" : "group-hover:scale-110",
                          )}
                        />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-semibold transition-premium",
                              isActive
                                ? "bg-white/20 text-primary-foreground"
                                : "bg-success/10 text-success border border-success/20",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="mt-auto px-4 pt-6 border-t border-sidebar-border">
                <nav className="space-y-1">
                  {bottomNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activeTab
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => handleMenuClick(item.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-premium text-sm font-medium group",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent hover:translate-x-0.5",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-premium",
                            isActive ? "" : "group-hover:scale-110",
                          )}
                        />
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
    </>
  )
}
