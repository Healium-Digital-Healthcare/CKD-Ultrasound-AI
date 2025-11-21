"use client"

import type React from "react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bell, LogOut, Menu, Plus, Search, Settings, Grid3x3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "../ui/input"
import { useUser } from "@/lib/contexts/UserContext"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  headerTitle: string
  onSearch?: (searchText: string) => void
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({ onSearch, onMobileMenuToggle }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const supabase = createClient()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    router.push(`${pathname}`)
    if (onSearch) onSearch(value)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
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
      <nav className="hidden md:flex items-center z-10 border-b border-gray-200 h-20 ml-16 bg-white">
        <div className="flex-1 flex items-center justify-between px-6">
          {/* Left Section - Title and Back/Search */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-medium text-gray-900">CKD Ultrasound AI</h1>
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center gap-3">
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback className="bg-primary text-white">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="text-red-600 hover:text-red-700 cursor-pointer py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out from your account? You'll need to log in again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut} className="rounded-lg bg-red-600 hover:bg-red-700">
              Yes, Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Header */}
      <div className="md:hidden h-20 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
        <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="text-gray-900">
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-medium text-gray-900">CCM System</h1>
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-[#687FE5] text-white">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
