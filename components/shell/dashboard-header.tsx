"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, User, FileText, ChevronDown, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Notifications from "@/components/notification/Notification"
import UserMenu from "@/components/setting/user-menu"
import { useLazyGlobalSearchQuery } from "@/store/services/cases"
import { CaseDetailDrawer } from "@/components/cases/case-detail-drawer"

interface DashboardHeaderProps {
  headerTitle?: string
  onSearch?: (searchText: string) => void
}

type SearchType = "patients" | "studies"

export default function DashboardHeader({ onSearch }: DashboardHeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<SearchType>("patients")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null)
  const [isCaseDrawerOpen, setIsCaseDrawerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)

  const [triggerSearch, { data: searchResults, isFetching }] = useLazyGlobalSearchQuery()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        triggerSearch({ q: searchQuery, type: searchType, limit: 5 })
        setIsDropdownOpen(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsDropdownOpen(false)
    }
  }, [searchQuery, searchType, triggerSearch])

  const handlePatientClick = (patientId: string) => {
    router.push(`/patients/${patientId}`)
    setIsDropdownOpen(false)
    setSearchQuery("")
  }

  const handleStudyClick = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber)
    setIsCaseDrawerOpen(true)
    setIsDropdownOpen(false)
    setSearchQuery("")
  }

  const searchTypeLabels: Record<SearchType, string> = {
    patients: "Patients",
    studies: "Studies",
  }

  const hasResults = searchResults && (searchResults.patients.length > 0 || searchResults.studies.length > 0)

  return (
    <div className="z-50">
      {/* Desktop Header */}
      <nav className="hidden md:flex items-center z-[9999] border-b border-border/40 h-16 ml-64 bg-background/80 backdrop-blur-md">
        <div className="flex-1 flex items-center justify-between px-6">
          {/* Left Section - Search */}
          <div className="relative flex-1 max-w-lg" ref={dropdownRef}>
            {/* Search Input with Type Selector Inside */}
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="text"
                value={searchQuery}
                placeholder={`Search ${searchType}...`}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (onSearch) onSearch(e.target.value)
                }}
                onFocus={() => searchQuery.length >= 2 && setIsDropdownOpen(true)}
                className="pl-9 pr-28 h-9 bg-muted/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary text-sm"
              />
              {isFetching && (
                <Loader2 className="absolute right-24 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
              )}
              
              {/* Search Type Selector - Right Side Inside Input */}
              <div className="absolute right-1 top-1/2 -translate-y-1/2" ref={typeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="flex items-center gap-1 h-7 px-2 bg-muted border border-border/50 rounded text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  {searchTypeLabels[searchType]}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {isTypeDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-28 bg-card border border-border rounded-md shadow-xl z-[9999]">
                    {(["patients", "studies"] as SearchType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSearchType(type)
                          setIsTypeDropdownOpen(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md ${
                          searchType === type ? "bg-muted font-medium" : ""
                        }`}
                      >
                        {searchTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {isDropdownOpen && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-xl z-[9999] max-h-[400px] overflow-auto">
                {isFetching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : hasResults ? (
                  <>
                    {/* Patients Section */}
                    {searchResults.patients.length > 0 && searchType === "patients" && (
                      <div>
                        <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                          Patients
                        </div>
                        {searchResults.patients.map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => handlePatientClick(patient.id)}
                            className="w-full px-3 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-foreground">{patient.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {patient.patient_id} | {patient.age} yrs | {patient.sex === "M" ? "Male" : "Female"}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Studies Section */}
                    {searchResults.studies.length > 0 && searchType === "studies" && (
                      <div>
                        <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                          Studies
                        </div>
                        {searchResults.studies.map((study) => (
                          <button
                            key={study.id}
                            type="button"
                            onClick={() => handleStudyClick(study.case_number)}
                            className="w-full px-3 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-foreground font-mono">{study.case_number}</p>
                              <p className="text-xs text-muted-foreground">
                                Patient: {study.patient?.name} | {new Date(study.study_date).toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No results found for {searchQuery}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Actions and User */}
          <div className="flex items-center gap-3">
            <Notifications />
            <div className="h-8 w-px bg-border/50" />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Case Detail Drawer */}
      <CaseDetailDrawer
        caseNumber={selectedCaseNumber}
        open={isCaseDrawerOpen}
        onOpenChange={setIsCaseDrawerOpen}
      />
    </div>
  )
}
