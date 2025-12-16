"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, UserPlus, Shield, MoreVertical, Search, Filter, Building, Mail, Phone } from "lucide-react"
import type { User, UserGroup } from "@/types/user"

export default function OrganizationSettingsPage() {
  const [activeTab, setActiveTab] = useState<"users" | "groups" | "organization">("organization")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hospital.com",
      role: "Admin",
      department: "Radiology",
      phone: "+1 (555) 123-4567",
      status: "active",
      last_login: "2024-01-15",
      created_at: "2023-06-10",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      email: "michael.chen@hospital.com",
      role: "Radiologist",
      department: "Nephrology",
      phone: "+1 (555) 234-5678",
      status: "active",
      last_login: "2024-01-14",
      created_at: "2023-07-22",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@hospital.com",
      role: "Clinician",
      department: "Internal Medicine",
      phone: "+1 (555) 345-6789",
      status: "active",
      last_login: "2024-01-15",
      created_at: "2023-08-15",
    },
    {
      id: "4",
      name: "John Davis",
      email: "john.davis@hospital.com",
      role: "Viewer",
      department: "Research",
      status: "inactive",
      last_login: "2023-12-20",
      created_at: "2023-09-01",
    },
  ]

  const groups: UserGroup[] = [
    {
      id: "1",
      name: "Radiology Team",
      description: "All radiologists and imaging specialists",
      permissions: ["view_cases", "create_cases", "edit_cases", "ai_analysis"],
      member_count: 12,
      created_at: "2023-06-01",
      updated_at: "2024-01-10",
    },
    {
      id: "2",
      name: "Nephrology Department",
      description: "Kidney disease specialists",
      permissions: ["view_cases", "view_patients", "edit_patients"],
      member_count: 8,
      created_at: "2023-06-01",
      updated_at: "2024-01-05",
    },
    {
      id: "3",
      name: "Administrators",
      description: "System administrators with full access",
      permissions: ["full_access", "manage_users", "manage_settings", "view_reports"],
      member_count: 3,
      created_at: "2023-06-01",
      updated_at: "2024-01-12",
    },
    {
      id: "4",
      name: "Research Team",
      description: "Clinical research and data analysis",
      permissions: ["view_cases", "view_reports", "export_data"],
      member_count: 5,
      created_at: "2023-07-15",
      updated_at: "2023-12-20",
    },
  ]

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    const colors = {
      Admin: "bg-purple-100 text-purple-700",
      Manager: "bg-blue-100 text-blue-700",
      Radiologist: "bg-green-100 text-green-700",
      Clinician: "bg-orange-100 text-orange-700",
      Viewer: "bg-gray-100 text-gray-700",
    }
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Organization Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your organization, users, and permissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("organization")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "organization"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Organization
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "groups"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            User Groups ({groups.length})
          </button>
        </nav>
      </div>

      {/* Organization Tab */}
      {activeTab === "organization" && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Profile</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="City General Hospital" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="org-type">Organization Type</Label>
                <Select defaultValue="hospital">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="private">Private Practice</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="org-email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="org-email" defaultValue="info@cityhospital.com" className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="org-phone">Phone</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input id="org-phone" defaultValue="+1 (555) 000-0000" className="pl-10" />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="org-address">Address</Label>
                <Input
                  id="org-address"
                  defaultValue="123 Medical Center Drive, Healthcare City, HC 12345"
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Users Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Users Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.department}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.last_login}</td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* User Groups Tab */}
      {activeTab === "groups" && (
        <div className="space-y-4">
          {/* Groups Controls */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Manage user groups and permissions</p>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Shield className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          {/* Groups Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group Name
                    </th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{group.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{group.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{group.member_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TooltipProvider>
                          <div className="flex flex-wrap gap-2">
                            {group.permissions.slice(0, 3).map((permission) => (
                              <span
                                key={permission}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                              >
                                {permission.replace(/_/g, " ")}
                              </span>
                            ))}
                            {group.permissions.length > 3 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
                                    +{group.permissions.length - 3} more
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-semibold text-xs mb-2">All Permissions:</p>
                                    {group.permissions.map((permission) => (
                                      <div key={permission} className="text-xs">
                                        • {permission.replace(/_/g, " ")}
                                      </div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Group</DropdownMenuItem>
                            <DropdownMenuItem>Manage Members</DropdownMenuItem>
                            <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete Group</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}