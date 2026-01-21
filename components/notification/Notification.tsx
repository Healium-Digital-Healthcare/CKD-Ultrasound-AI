"use client"

import { useState } from "react"
import { Bell, CheckCircle, AlertCircle, Scan, Clock, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetNotificationCountQuery,
  type Notification,
} from "@/store/services/notifications"
import { formatDistanceToNow } from "date-fns"

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "scan_complete":
      return <Scan className="h-5 w-5 text-primary" />
    case "ckd_detected":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    case "report_generated":
      return <FileText className="h-5 w-5 text-green-600" />
    default:
      return <CheckCircle className="h-5 w-5 text-blue-600" />
  }
}

const getNotificationBg = (type: Notification["type"], isRead: boolean) => {
  if (isRead) return ""
  switch (type) {
    case "ckd_detected":
      return "bg-red-50/50"
    case "scan_complete":
      return "bg-blue-50/50"
    case "report_generated":
      return "bg-green-50/50"
    default:
      return "bg-blue-50/50"
  }
}

export default function Notifications() {
  const [open, setOpen] = useState(false)
  
  // Fetch count with polling (lightweight, runs always)
  const { data: countData } = useGetNotificationCountQuery(undefined, {
    pollingInterval: 30000, // Poll every 30 seconds
  })
  
  // Fetch full notifications only when popover is open
  const { data, isLoading } = useGetNotificationsQuery(
    { limit: 20, offset: 0 },
    { skip: !open } // Only fetch when popover is open
  )
  const [markAsRead] = useMarkAsReadMutation()
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation()

  const notifications = data?.notifications || []
  const unreadCount = countData?.count || 0

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h3 className="font-semibold text-base">Notifications</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead} 
              disabled={isMarkingAll}
              className="h-8 text-xs"
            >
              {isMarkingAll ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Loader2 className="h-8 w-8 text-muted-foreground/40 mb-3 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors relative",
                    getNotificationBg(notification.type, notification.is_read),
                  )}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.is_read && <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center text-sm h-9" onClick={() => setOpen(false)}>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
