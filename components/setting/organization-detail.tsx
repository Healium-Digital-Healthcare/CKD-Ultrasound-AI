"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone } from "lucide-react"

export function OrganizationTab() {
  return (
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
  )
}
