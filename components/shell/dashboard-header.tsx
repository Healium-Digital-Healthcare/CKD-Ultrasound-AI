"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/contexts/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Notifications from "@/components/notification/Notification"
import UserMenu from "@/components/setting/user-menu"

interface DashboardHeaderProps {
  headerTitle: string
  onSearch?: (searchText: string) => void
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({ onSearch, onMobileMenuToggle }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    router.push(`${pathname}`)
    if (onSearch) onSearch(value)
  }

  const handleAddPatient = () => router.push("/patients/new")
  const handleAddCase = () => router.push("/cases/new")

  const isDashboardPage = pathname === "/dashboard"
  const isPatientPage = pathname === "/patients"
  const isCasesPage = pathname === "/cases"
  const isNewCasePage = pathname === "/cases/new"
  const isNewPatientPage = pathname === "/patients/new"

  return (
    <div>
      {/* Desktop Header */}
      <nav className="hidden md:flex items-center z-10 border-b border-border/50 h-20 ml-64 bg-card/95 backdrop-blur-xl shadow-premium">
        <div className="flex-1 flex items-center justify-between px-6">
          {/* Left Section - Title and Back/Search */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">CKD Ultrasound AI</h1>
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Notifications />

            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden h-20 flex items-center justify-between px-4 border-b border-border/50 bg-card/95 backdrop-blur-xl shadow-premium">
        <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="text-gray-900">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-medium text-gray-900">CCM System</h1>
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
