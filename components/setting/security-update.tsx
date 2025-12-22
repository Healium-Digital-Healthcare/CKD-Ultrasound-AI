"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Lock, Shield, Clock, Mail } from "lucide-react"

export function SecurityTab() {
  const loggedInEmail = "user@organization.com"

  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    passwordExpiry: "90",
  })

  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!")
      return
    }
    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters!")
      return
    }
    alert("Password changed successfully!")
    setPasswords({ new: "", confirm: "" })
  }

  const handleSecuritySave = () => {
    alert("Security settings saved successfully!")
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" }
    if (password.length < 6) return { strength: 1, label: "Weak" }
    if (password.length < 10) return { strength: 2, label: "Fair" }
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: "Strong" }
    }
    return { strength: 2, label: "Fair" }
  }

  const passwordStrength = getPasswordStrength(passwords.new)

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

      <Accordion type="single" collapsible className="space-y-4">
        {/* Password Management Section */}
        <AccordionItem value="password" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Password Management</h3>
                <p className="text-xs text-gray-500">Change your account password</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="mt-1.5"
                  />
                  {passwords.new && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              passwordStrength.strength === 1
                                ? "bg-red-500 w-1/3"
                                : passwordStrength.strength === 2
                                  ? "bg-yellow-500 w-2/3"
                                  : passwordStrength.strength === 3
                                    ? "bg-green-500 w-full"
                                    : ""
                            }`}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 min-w-[45px]">{passwordStrength.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">Min 8 characters</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="mt-1.5"
                  />
                  {passwords.confirm && passwords.new !== passwords.confirm && (
                    <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handlePasswordChange} size="sm">
                  Update Password
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Two-Factor Authentication Section */}
        <AccordionItem value="2fa" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">Secure your account with email verification</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-900">
                  When enabled, you'll receive a verification code via email each time you sign in.
                </p>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                  <p className="text-xs text-gray-500 mt-0.5">Require email verification at login</p>
                </div>
                <Switch checked={is2FAEnabled} onCheckedChange={setIs2FAEnabled} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Session Management Section */}
        <AccordionItem value="session" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Session Management</h3>
                <p className="text-xs text-gray-500">Control session timeout and password expiry</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Auto logout after inactivity</p>
                </div>

                <div>
                  <Label htmlFor="password-expiry">Password Expiry</Label>
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordExpiry: value })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Require password change periodically</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSecuritySave} size="sm">
                  Save Settings
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Access Control Section */}
        <AccordionItem value="access" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Access Control</h3>
                <p className="text-xs text-gray-500">Manage login attempts and device tracking</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Lock account after failed attempts</p>
                </div>

                <div>
                  <Label htmlFor="lockout-duration">Lockout Duration</Label>
                  <Select defaultValue="15">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Time before retry is allowed</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSecuritySave} size="sm">
                  Save Settings
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
