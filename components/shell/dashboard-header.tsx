"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Notifications from "@/components/notification/Notification"
import UserMenu from "@/components/setting/user-menu"

interface DashboardHeaderProps {
  headerTitle: string
  onSearch?: (searchText: string) => void
}

export default function DashboardHeader({ onSearch }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

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
    </div>
  )
}
