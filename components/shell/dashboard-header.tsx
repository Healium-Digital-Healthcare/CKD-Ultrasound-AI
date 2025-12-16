"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  return (
    <div>
      {/* Desktop Header */}
      <nav className="hidden md:flex items-center z-10 border-b border-border/40 h-16 ml-64 bg-background/80 backdrop-blur-md">
        <div className="flex-1 flex items-center justify-between px-6">
          {/* Left Section - Title */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search patients, cases, or reports..."
                onChange={handleSearch}
                className="pl-9 h-9 bg-muted/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary text-sm"
              />
            </div>
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="h-8 w-px bg-border/50" />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="text-foreground">
          <Menu className="h-5 w-5" />
        </Button>
        {/* Left Section - Title */}
        <div className="flex-1 mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
              className="pl-9 h-9 bg-muted/50 border-border/50 text-sm"
            />
          </div>
        </div>
        {/* Right Section - User */}
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
