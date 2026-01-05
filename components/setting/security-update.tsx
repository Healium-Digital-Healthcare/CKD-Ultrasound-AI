"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Lock, Shield, Clock, Mail, EyeOff, Eye } from "lucide-react"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ca } from "zod/v4/locales"
import { TwoFactorSetup } from "./TwoFactorSetup"

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type PasswordFormValues = z.infer<typeof passwordSchema>


export function SecurityTab() {
  const supabase = createClient()

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    passwordExpiry: "90",
  })

  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: PasswordFormValues) => {
    try{
      setUpdatingPassword(true)
      const { data, error } = await supabase.auth.updateUser({
        password: values.newPassword,
      })
      if(error) {
        throw error
      }
      else {
        toast.success("Password updated successfully!")
        form.reset()
      }
    } catch (error: any) {
      if (error.message.includes("same password")) {
          toast.error("New password should be different from the old password.")
        } else {
          toast.error("Failed to update password", error.message)
      }
    } finally {
      setUpdatingPassword(false)
    }
  }

  const handleSecuritySave = () => {
    alert("Security settings saved successfully!")
  }

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
          <Lock className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left">
          <h3 className="text-sm font-semibold text-gray-900">Password Management</h3>
          <p className="text-xs text-gray-500">Change your account password</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center w-full justify-between gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNew ? "text" : "password"}
                        placeholder="Enter new password"
                      />
                      <span
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                      />
                      <span
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={updatingPassword}>
              {updatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
      {/* <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="password" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
          </AccordionTrigger>

          <AccordionContent className="pt-4 pb-2 px-2">
            
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2fa" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500">Secure your account with MFA</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2">
            <TwoFactorSetup />
          </AccordionContent>
        </AccordionItem>

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
      </Accordion> */}
    </Card>
  )
}