"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import 'react-phone-number-input/style.css'
import { isPossiblePhoneNumber } from 'react-phone-number-input'


import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Mail, Phone } from "lucide-react"
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from "@/store/services/organization"
import { useEffect } from "react"
import { toast } from "sonner"
import { PhoneInput } from "../ui/phone-input"

/* -------------------------------------------------------------------------- */
/* ZOD SCHEMA                                                                  */
/* -------------------------------------------------------------------------- */

export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
  organization_type: z.enum([
    "hospital",
    "clinic",
    "private_practice",
    "research",
  ]),
  department: z.string().optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  phone_number: z
  .string()
  .optional()
  .or(z.literal(""))
  .refine(val => !val || isPossiblePhoneNumber(val), {
    message: "Invalid phone number",
  }),

  address: z.string().optional(),
})

type OrganizationFormValues = z.infer<typeof organizationSchema>

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                   */
/* -------------------------------------------------------------------------- */

export function OrganizationTab() {

  const { data, isLoading: orgLoading, isFetching: orgFetching } = useGetOrganizationQuery()

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      organization_type: "hospital",
      department: "",
      email: "",
      phone_number: "",
      address: "",
    },
  })

  const [ updateOrganization, { isLoading, isSuccess, isError }] = useUpdateOrganizationMutation()

  const onSubmit = async (values: OrganizationFormValues) => {
    await updateOrganization({
      body: {
        name: values.name,
        organization_type: values.organization_type,
        department: values.department,
        email: values.email,
        phone_number: values.phone_number,
        address: values.address
      }
    })
  }

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        organization_type: data.organization_type || "hospital",
        department: data.department || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
      })
    }
  }, [data, form])


  useEffect(() => {
    if (isSuccess) {
      toast.success("Organization profile updated successfully")
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      toast.error("Failed to update organization profile")
    }
  }, [isError])

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">
        Organization Profile
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ---------------- Row 1 ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Organization Type — WIDE */}
            <FormField
              control={form.control}
              name="organization_type"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Organization Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="private_practice">
                        Private Practice
                      </SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Radiology, Cardiology"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ---------------- Row 2 ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                      <PhoneInput
                        {...field}
                        international
                        defaultCountry="US"
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t">
            <Button 
            type="submit"
            disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
