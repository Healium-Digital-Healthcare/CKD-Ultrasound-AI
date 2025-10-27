"use client"

import { useState } from "react"
import { User, Lock, Server, Save, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {

  // Profile state
  const [profile, setProfile] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    role: "Radiologist",
    department: "Nephrology",
    phone: "+1 (555) 123-4567",
  })

  // Password state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // PACS Integration state
  const [pacsConfig, setPacsConfig] = useState({
    serverUrl: "pacs.hospital.com",
    port: "11112",
    aeTitle: "KIDNEY_AI",
    callingAeTitle: "WORKSTATION",
    username: "admin",
    password: "",
    autoUpload: true,
  })

  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "pacs">("profile")

  const handleProfileSave = () => {
    console.log("[v0] Saving profile:", profile)
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!")
      return
    }
    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters!")
      return
    }
    console.log("[v0] Changing password")
    alert("Password changed successfully!")
    setPasswords({ current: "", new: "", confirm: "" })
  }

  const handlePacsSave = () => {
    console.log("[v0] Saving PACS config:", pacsConfig)
    alert("PACS configuration saved successfully!")
  }

  const handlePacsTest = async () => {
    setTestStatus("testing")
    console.log("[v0] Testing PACS connection:", pacsConfig)

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success
    setTestStatus("success")
    setTimeout(() => setTestStatus("idle"), 3000)
  }

  return (
    <div className="bg-black h-full">

      <div className="h-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Vertical Tab List */}
            <div className="w-64 flex-shrink-0 bg-[#1a1a1a] ">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#009A6B] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "security"
                      ? "bg-[#009A6B] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Security</span>
                </button>

                <button
                  onClick={() => setActiveTab("pacs")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "pacs"
                      ? "bg-[#009A6B] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  <Server className="w-5 h-5" />
                  <span className="font-medium">PACS Integration</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="role" className="text-gray-700 font-medium">
                          Role
                        </Label>
                        <Input
                          id="role"
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="department" className="text-gray-700 font-medium">
                          Department
                        </Label>
                        <Input
                          id="department"
                          value={profile.department}
                          onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleProfileSave} className="bg-[#009A6B] hover:bg-[#008059] text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>

                  <div className="space-y-6 max-w-md">
                    <div>
                      <Label htmlFor="current-password" className="text-gray-700 font-medium">
                        Current Password
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-password" className="text-gray-700 font-medium">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handlePasswordChange} className="bg-[#009A6B] hover:bg-[#008059] text-white">
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* PACS Integration Tab */}
              {activeTab === "pacs" && (
                <div className="bg-white rounded-lg p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">PACS Integration</h2>
                      <p className="text-gray-600 mt-1">Configure automatic image upload from PACS system</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${pacsConfig.autoUpload ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      <span className="text-sm text-gray-600">
                        {pacsConfig.autoUpload ? "Auto-upload enabled" : "Auto-upload disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="server-url" className="text-gray-700 font-medium">
                          PACS Server URL
                        </Label>
                        <Input
                          id="server-url"
                          value={pacsConfig.serverUrl}
                          onChange={(e) => setPacsConfig({ ...pacsConfig, serverUrl: e.target.value })}
                          placeholder="pacs.hospital.com"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="port" className="text-gray-700 font-medium">
                          Port
                        </Label>
                        <Input
                          id="port"
                          value={pacsConfig.port}
                          onChange={(e) => setPacsConfig({ ...pacsConfig, port: e.target.value })}
                          placeholder="11112"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ae-title" className="text-gray-700 font-medium">
                          AE Title
                        </Label>
                        <Input
                          id="ae-title"
                          value={pacsConfig.aeTitle}
                          onChange={(e) => setPacsConfig({ ...pacsConfig, aeTitle: e.target.value })}
                          placeholder="KIDNEY_AI"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="calling-ae-title" className="text-gray-700 font-medium">
                          Calling AE Title
                        </Label>
                        <Input
                          id="calling-ae-title"
                          value={pacsConfig.callingAeTitle}
                          onChange={(e) => setPacsConfig({ ...pacsConfig, callingAeTitle: e.target.value })}
                          placeholder="WORKSTATION"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pacs-username" className="text-gray-700 font-medium">
                          Username
                        </Label>
                        <Input
                          id="pacs-username"
                          value={pacsConfig.username}
                          onChange={(e) => setPacsConfig({ ...pacsConfig, username: e.target.value })}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pacs-password" className="text-gray-700 font-medium">
                          Password
                        </Label>
                        <Input
                          id="pacs-password"
                          type="password"
                          value={pacsConfig.password}
                          onChange={(e) => setPacsConfig({ ...pacsConfig, password: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="auto-upload"
                        checked={pacsConfig.autoUpload}
                        onChange={(e) => setPacsConfig({ ...pacsConfig, autoUpload: e.target.checked })}
                        className="w-4 h-4 text-[#009A6B] rounded focus:ring-[#009A6B]"
                      />
                      <Label htmlFor="auto-upload" className="text-gray-700 font-medium cursor-pointer">
                        Enable automatic upload from PACS
                      </Label>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        onClick={handlePacsTest}
                        variant="outline"
                        disabled={testStatus === "testing"}
                        className="border-[#009A6B] text-[#009A6B] hover:bg-[#009A6B] hover:text-white bg-transparent"
                      >
                        <TestTube className="w-4 h-4 mr-2" />
                        {testStatus === "testing"
                          ? "Testing..."
                          : testStatus === "success"
                            ? "Connection Successful!"
                            : "Test Connection"}
                      </Button>

                      <Button onClick={handlePacsSave} className="bg-[#009A6B] hover:bg-[#008059] text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Configuration
                      </Button>
                    </div>

                    {testStatus === "success" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">✓ Successfully connected to PACS server</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
