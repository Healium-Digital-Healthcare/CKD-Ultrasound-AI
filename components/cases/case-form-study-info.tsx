"use client"

import { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { CaseFormValues } from "@/lib/schemas/case"

interface CaseFormStudyInfoProps {
  form: UseFormReturn<CaseFormValues>;
}

export function CaseFormStudyInfo({ form }: CaseFormStudyInfoProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Study Information</CardTitle>
        <CardDescription>Enter details about the ultrasound study</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Study Description *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Kidney Ultrasound" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studyDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Study Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
