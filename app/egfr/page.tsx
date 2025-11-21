"use client"

import type React from "react"
import { useState } from "react"
import { Calculator, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EgfrCalculator() {
  const [ipScr, setIPScr] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [egfr, setEgfr] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value)
  }

  const egfrCalc = () => {
    const scrValue = Number.parseFloat(ipScr)
    const ageValue = Number.parseFloat(age)

    if (!scrValue || !ageValue || scrValue <= 0 || ageValue <= 0) {
      alert("Please enter valid values for Serum Creatinine and Age")
      return
    }

    let result: number
    if (gender === "male") {
      result = Math.ceil(175 * Math.pow(scrValue, -1.154) * Math.pow(ageValue, -0.203))
    } else {
      result = Math.floor(175 * Math.pow(scrValue, -1.154) * Math.pow(ageValue, -0.203) * 0.742)
    }

    setEgfr(result)
    setShowResult(true)
  }

  const clearAll = () => {
    setEgfr(null)
    setIPScr("")
    setAge("")
    setGender("male")
    setShowResult(false)
  }

  const getSeverityLevel = (value: number) => {
    if (value > 60) return { label: "Normal", color: "text-green-600", bg: "bg-green-50", border: "border-green-500" }
    if (value >= 45) return { label: "Low", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-500" }
    if (value >= 30)
      return { label: "Moderate", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-500" }
    return { label: "High Risk", color: "text-red-600", bg: "bg-red-50", border: "border-red-500" }
  }

  const severity = egfr !== null ? getSeverityLevel(egfr) : null

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-8">
      {/* Input Card */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Patient Information</h2>

        <div className="space-y-5 mb-6">
          {/* Serum Creatinine Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Serum Creatinine (Scr)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="number"
                  step="0.01"
                  value={ipScr}
                  onChange={(e) => setIPScr(e.target.value)}
                  placeholder="Enter value"
                  className="w-full pl-10 pr-3 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <select className="px-4 py-2.5 border border-input rounded-lg bg-background text-foreground font-medium text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="mg/dl">mg/dL</option>
              </select>
            </div>
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Age</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
                className="w-full pl-10 pr-16 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                Years
              </span>
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Gender</label>
            <div className="flex gap-3">
              <label
                className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all flex-1 ${
                  gender === "male" ? "border-primary bg-primary/5" : "border-input hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="male"
                  checked={gender === "male"}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium text-sm">Male</span>
              </label>
              <label
                className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all flex-1 ${
                  gender === "female" ? "border-primary bg-primary/5" : "border-input hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="female"
                  checked={gender === "female"}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium text-sm">Female</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={egfrCalc}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 transition-colors shadow-sm text-sm font-medium"
          >
            Calculate eGFR
          </Button>
          <Button
            variant="outline"
            onClick={clearAll}
            className="px-6 py-2.5 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors text-sm font-medium bg-transparent"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-white border border-border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">eGFR Results</h2>

        {showResult && egfr !== null ? (
          <div>
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-6xl font-bold text-foreground">{egfr}</span>
                <span className="text-muted-foreground text-base font-medium">mL/min/1.73m²</span>
              </div>
              {severity && (
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${severity.bg} ${severity.border} border-2`}
                >
                  <span className={`text-sm font-semibold ${severity.color}`}>{severity.label}</span>
                </div>
              )}
            </div>

            {/* Severity Scale */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-foreground">Kidney Function Scale</div>
              <div className="flex h-3 rounded-full overflow-hidden shadow-sm">
                <div className="bg-green-500 flex-[3]"></div>
                <div className="bg-yellow-400 flex-[1]"></div>
                <div className="bg-orange-500 flex-[1]"></div>
                <div className="bg-red-500 flex-[2]"></div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-green-600 mb-1">Normal</div>
                  <div className="text-muted-foreground">&gt;60</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-yellow-600 mb-1">Low</div>
                  <div className="text-muted-foreground">45-59</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600 mb-1">Moderate</div>
                  <div className="text-muted-foreground">30-44</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600 mb-1">High Risk</div>
                  <div className="text-muted-foreground">&lt;30</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Enter patient information and click Calculate to see results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
