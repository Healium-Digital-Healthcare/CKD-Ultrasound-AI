"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Settings, User, HelpCircle, Shield, CreditCard } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/lib/contexts/UserContext"
import { createClient } from "@/lib/supabase/client"

export default function UserMenu() {
  const router = useRouter()
  const { user } = useUser()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  // Extract user initials from email
  const getUserInitials = () => {
    if (!user?.email) return "U"
    const email = user.email
    const name = email.split("@")[0]
    return name
      .split(/[._-]/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
  }

  // Get user display name from email
  const getUserDisplayName = () => {
    if (!user?.email) return "User"
    const name = user.email.split("@")[0]
    return name
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const userRole = "Healthcare Provider" // This could come from user metadata

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50">
            <Avatar className="h-9 w-9 ring-2 ring-gray-100">
              <AvatarImage src="/placeholder-user.jpg" alt={getUserDisplayName()} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-green-600 text-white text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* User Profile Section */}
          <DropdownMenuLabel className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                <AvatarImage src="/placeholder-user.jpg" alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-green-600 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{getUserDisplayName()}</span>
                <span className="text-xs text-gray-500">{userRole}</span>
                <span className="text-xs text-gray-400 mt-0.5">{user?.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Profile Link */}
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-gray-50">
            <Link href="/profile" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">My Profile</span>
                <span className="text-xs text-gray-500">View and edit profile</span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Settings Link */}
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-gray-50">
            <Link href="/settings" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Settings</span>
                <span className="text-xs text-gray-500">Preferences & security</span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Help & Support */}
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-gray-50">
            <Link href="/help" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50">
                <HelpCircle className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Help & Support</span>
                <span className="text-xs text-gray-500">Get assistance</span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Privacy & Terms */}
          <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-gray-50">
            <Link href="/privacy" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50">
                <Shield className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Privacy & Security</span>
                <span className="text-xs text-gray-500">HIPAA compliance</span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer py-2.5 focus:bg-red-50 focus:text-red-700"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Log Out</span>
                <span className="text-xs text-red-400">Sign out of account</span>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to sign out from your account? You&apos;ll need to log in again to access the
              dashboard and your patient data.
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
    </>
  )
}
