export interface User {
  id: string
  email: string
  name: string
  role: "Admin" | "Manager" | "Radiologist" | "Clinician" | "Viewer"
  department: string
  phone?: string
  avatar?: string
  status: "active" | "inactive"
  last_login?: string
  created_at: string
}

export interface UserGroup {
  id: string
  name: string
  description: string
  permissions: string[]
  member_count: number
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  type: "Hospital" | "Clinic" | "Private Practice" | "Research"
  description?: string
  address?: string
  phone?: string
  email?: string
  logo?: string
  created_at: string
  updated_at: string
}
