"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, UserPlus, Check } from "lucide-react"
import { useCreatePatientMutation, useGetPatientsQuery } from "@/store/services/patients"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Patient } from "@/types/patient"

interface StudyPatientSelectionProps {
  defaultPatientId?: string
  onComplete: (data: any) => void
}

export function StudyPatientSelection({ defaultPatientId, onComplete }: StudyPatientSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // New patient form
  const [newPatientName, setNewPatientName] = useState("")
  const [newPatientAge, setNewPatientAge] = useState("")
  const [newPatientGender, setNewPatientGender] = useState<"M" | "F">("M")

  const { data: patientsData, isLoading } = useGetPatientsQuery({
    params: {
      search: searchQuery
    }
  })
  
  const [createPatient, { data: createdPatient, isLoading: createPatientLoading, isSuccess: createPatientSuccess, isError: createPatientError }] = useCreatePatientMutation()

  const patients = patientsData?.data || []

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    onComplete(patient)
  }

  const handleCreateNewPatient = async() => {
    if (!newPatientName || !newPatientAge || !newPatientGender) return

    const newPatient = {
      patient_id: `${new Date().toISOString().slice(0, 10).replace(/-/g, "")}` + `${Math.floor(1000 + Math.random() * 9000)}`,
      name: newPatientName,
      age: Number.parseInt(newPatientAge),
      sex: newPatientGender,
    }

    await createPatient(newPatient)
  }

  useEffect(() => {
    if(defaultPatientId && patients.length > 0) {
      const selected = patients.find(p => p.id === defaultPatientId)
      if(selected) {
        setSelectedPatient(selected)
      }
    }
  }, [defaultPatientId])

  useEffect(() => {
    if(createPatientSuccess && createdPatient) {
      setSelectedPatient(createdPatient)
      setShowCreateDialog(false)
      onComplete(createdPatient)
    }
  }, [createPatientSuccess])

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="max-w-4xl mx-auto w-full p-8 space-y-6">
        {/* Search Bar - Prominent and easy to use */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Type patient name or ID to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-background border-2 focus:border-primary"
            autoFocus
          />
        </div>

        {/* Quick Action */}
        <Button
          variant="outline"
          size="lg"
          className="w-full h-14 justify-start gap-3 border-2 border-dashed hover:bg-accent hover:border-primary bg-transparent"
          onClick={() => setShowCreateDialog(true)}
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm">Create New Patient</div>
            <div className="text-xs text-muted-foreground">Add a new patient record</div>
          </div>
        </Button>

        {/* Patient List - Clean and scannable */}
        <div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-background p-3 rounded-lg border flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
              ))}
            </div>
          ) : patients.length === 0 && searchQuery ? (
            <div className="text-center py-12 bg-background rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground mb-4">No patients found matching &ldquo;{searchQuery}&rdquo;</p>
              <Button variant="default" onClick={() => setShowCreateDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Patient
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {patients.map((patient: any) => {
                const initials = patient.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                const isSelected = selectedPatient?.id === patient.id

                return (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`
                      w-full p-3 rounded-lg border transition-all text-left
                      flex items-center gap-3 bg-background
                      hover:border-primary hover:bg-accent
                      active:scale-[0.99]
                      ${isSelected ? "border-primary bg-accent" : "border-border"}
                    `}
                  >
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-0.5">{patient.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-mono text-[10px] py-0 h-5">
                          {patient.patient_id}
                        </Badge>
                        <span>{patient.age}y</span>
                        <span>•</span>
                        <span>{patient.sex === "M" ? "Male" : "Female"}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create New Patient Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Patient</DialogTitle>
            <DialogDescription>Enter the patient information to create a new record</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name">Patient Name *</Label>
              <Input
                id="name"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="Enter full name"
                className="mt-1.5"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={newPatientAge}
                  onChange={(e) => setNewPatientAge(e.target.value)}
                  placeholder="Age"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="gender">Sex *</Label>
                <Select value={newPatientGender} onValueChange={(v: any) => setNewPatientGender(v)}>
                  <SelectTrigger id="gender" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" disabled={createPatientLoading} onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateNewPatient} disabled={createPatientLoading || !newPatientName || !newPatientAge || !newPatientGender} className="flex-1">
                {createPatientLoading ? "Creating" : "Create & Continue"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
