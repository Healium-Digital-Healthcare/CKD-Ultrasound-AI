"use client";

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import type { CaseFormValues } from "@/lib/schemas/case"
import { useLazyGetPatientByPatientIdQuery } from "@/store/services/patients";

interface CaseFormPatientInfoProps {
  form: UseFormReturn<CaseFormValues>;
}

export function CaseFormPatientInfo({ form }: CaseFormPatientInfoProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [fetchPatient, { data: fetchedPatient, isLoading }] = useLazyGetPatientByPatientIdQuery();
  
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const patientType = form.getValues("patientType");
    const patientName = form.getValues("patientName");
    
    
    if (patientType === "existing" && patientName) {
      setShowDetails(true);
    }
  }, [form]);

  const patientType = form.watch("patientType");

  const handleFindPatient = async () => {
    const isValid = await form.trigger("patientNumber")
    if (!isValid) return

    const patientId = form.getValues("patientNumber")
    
    try {
      const result = await fetchPatient(patientId).unwrap();
      
      form.setValue("patientName", result.data.name);
      form.setValue("patientId", result.data.id);
      form.setValue("age", result.data.age.toString());
      form.setValue("gender", result.data.sex);
      
      setShowDetails(true);
    } catch (error) {
      form.setError("patientId", { message: "Patient not found" });
      setShowDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PATIENT TYPE CARD */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Patient Type</CardTitle>
          <CardDescription>Select whether this is a new or existing patient</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="patientType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowDetails(false);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                    className="flex items-center gap-8"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="new" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        New Patient
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="existing" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Existing Patient
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* EXISTING PATIENT UI */}
      {patientType === "existing" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Find Existing Patient</CardTitle>
            <CardDescription>Search patient by Patient ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="patientNumber"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Patient ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Patient ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="button" 
                onClick={handleFindPatient}
                disabled={isLoading} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Searching..." : "Find Patient"}
              </Button>
            </div>

            {mounted && showDetails && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label>Patient Name</Label>
                  <Input value={form.getValues("patientName")} readOnly className="bg-gray-50 mt-1" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={form.getValues("age")} readOnly className="bg-gray-50 mt-1" />
                </div>
                <div>
                  <Label>Sex</Label>
                  <Input value={form.getValues("gender")} readOnly className="bg-gray-50 mt-1" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* NEW PATIENT FORM */}
      {patientType === "new" && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>New Patient Details</CardTitle>
            <CardDescription>Enter details for the new patient</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}