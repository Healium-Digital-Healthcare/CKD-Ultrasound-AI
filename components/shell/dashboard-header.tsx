"use client"

import type React from "react"
import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bell, LogOut, Menu, Plus, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "../ui/input"
import { useUser } from "@/lib/contexts/UserContext"
import { createClient } from "@/lib/supabase/client"

interface DashboardHeaderProps {
  headerTitle: string
  onSearch?: (searchText: string) => void
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({ headerTitle, onSearch, onMobileMenuToggle }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const supabase = createClient()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("search", value)
    else params.delete("search")
    router.push(`${pathname}?${params.toString()}`)
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
    <>
      {/* Desktop Header */}
      <nav className="hidden md:flex items-center bg-black fixed w-full z-10 border-b border-[#1f2937] h-20">
        {/* Logo Section */}
        <div className="flex-shrink-0 w-64 border-r border-[#1f2937] h-full flex items-center px-6 gap-2">
          <Link href="/">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/logo/logo.svg" className="w-8 h-8" />
            </div>
          </Link>
          <div className="flex flex-col items-start">
            <Link href="/">
              <span className="font-semibold text-lg text-[#687FE5]">Healium CKD AI</span>
            </Link>
            <Link href="https://www.healiumintelliscan.com" target="_blank" className="text-[#687FE5]">
              <span className="text-sm">by Healium Intelliscan</span>
            </Link>
          </div>
        </div>

        {/* Header Content */}
        <div className="flex-1 flex items-center justify-between px-6">
          <div className="flex-1 max-w-md">
            {(isNewCasePage || isNewPatientPage) && (
              <Button
                onClick={() => router.back()}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-[#1f2937]"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
            )}
            {(isPatientPage || isCasesPage) && (
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isPatientPage ? "Search patients..." : "Search cases..."}
                  onChange={handleSearch}
                  defaultValue={searchParams.get("search") || ""}
                  className="pl-10 text-white"
                />
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {isPatientPage && (
              <Button
                onClick={handleAddPatient}
                className="bg-[#009A6B] hover:bg-[#008059] text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            )}
            {(isCasesPage || isDashboardPage) && (
              <Button
                onClick={handleAddCase}
                className="bg-[#009A6B] hover:bg-[#008059] text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                New Case
              </Button>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#1f2937]">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-9 h-9 bg-[#009A6B] rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0a0e1a] border-[#1f2937]">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#009A6B] rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#1f2937]" />

                <DropdownMenuItem asChild className="text-white hover:bg-[#1f2937] cursor-pointer py-2.5">
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#1f2937]" />

                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="text-red-400 hover:bg-[#1f2937] hover:text-red-300 cursor-pointer py-2.5"
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
            <AlertDialogDescription className="">
              Are you sure you want to sign out from your account? You’ll need to log in again to access the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-lg text-primary">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="text-white rounded-lg"
            >
              Yes, Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile Header */}
      <div className="md:hidden bg-black h-20 flex items-center justify-between px-4 border-b border-[#1f2937]">
        <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#009A6B] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-white font-semibold text-lg">KidneyAI</span>
        </div>
        <div className="w-10" />
      </div>
    </>
  )
}
