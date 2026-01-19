"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetPatientQuery } from "@/store/services/patients"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { PatientOverview } from "@/components/patients/patient-overview"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"
import { cn } from "@/lib/utils"
import { PatientDetailSkeleton } from "@/components/patients/patient-detail-skeleton"
import { PatientStudiesList } from "@/components/patients/patient-studies"

export default function PatientDetailPage({ params }: { params: Promise<{ patient_id: string }> }) {
  const { patient_id } = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)

  const { data: patient, isLoading: patientLoading, isError: patientError } = useGetPatientQuery(patient_id)

  const handleCaseClick = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber)
    setIsDrawerOpen(true)
  }

  const getStatusColor = (severity: string) => {
    switch (severity) {
      case "normal":
      case "mild":
        return "bg-green-50 text-green-700 border-green-200"
      case "moderate":
      case "severe":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "critical":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const getStatusLabel = (severity: string) => {
    if (severity === "normal" || severity === "mild") return "Stable"
    if (severity === "moderate" || severity === "severe") return "Recovering"
    if (severity === "critical") return "Critical"
    return "Unknown"
  }

  if (patientLoading) {
    return <PatientDetailSkeleton />
  }

  if (patientError || !patient) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center">
        <p className="text-lg text-gray-600 mb-4">Patient not found</p>
        <Button onClick={() => router.push("/patients")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "studies", label: "Studies" }
  ]

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/patients")}
              className="gap-2 -ml-2 hover:bg-gray-100 text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Patients
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-semibold text-2xl shadow-sm">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">{patient.name}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">ID:</span>
                  <span className="font-mono">{patient.patient_id}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Age:</span>
                  <span>{patient.age} years old</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Sex:</span>
                  <span>{patient.sex === "M" ? "Male" : "Female"}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
              className="gap-2 hover:bg-gray-100"
            >
              {isHeaderExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Details
                </>
              )}
            </Button>
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isHeaderExpanded ? "max-h-[200px] opacity-100 mb-6" : "max-h-0 opacity-0 mb-0",
            )}
          >
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CKD Stage</p>
                  <p className="text-base font-semibold text-gray-900">
                    {patient.ckd_stage ? `Stage ${patient.ckd_stage}` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Current eGFR</p>
                  <p className="text-base font-semibold text-gray-900">
                    {patient.egfr ? `${patient.egfr.toFixed(1)} mL/min/1.73m²` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                  <Badge variant="outline" className={cn("font-medium", getStatusColor(patient.severity ?? ""))}>
                    {getStatusLabel(patient.severity ?? "")}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Scanned</p>
                  <p className="text-base font-semibold text-gray-900">
                    {patient.scanned_on ? new Date(patient.scanned_on).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="text-base font-semibold text-gray-900">
                    {patient.last_updated ? new Date(patient.last_updated).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex gap-8 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "pb-4 px-1 border-b-2 font-medium text-sm transition-colors relative",
                    activeTab === tab.id
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "overview" && <PatientOverview patientId={patient_id} />}
        {activeTab === "studies" && (
          <PatientStudiesList patientId={patient_id} onCaseClick={handleCaseClick}/>
        )}
      </div>

      <CaseDetailDrawer caseNumber={selectedCaseNumber} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}
