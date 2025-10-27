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
    if (value > 60)
      return { label: "Normal", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500" }
    if (value >= 45)
      return { label: "Low", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500" }
    if (value >= 30)
      return { label: "Moderate", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500" }
    return { label: "High Risk", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500" }
  }

  const severity = egfr !== null ? getSeverityLevel(egfr) : null

  return (
    <div className="bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">eGFR Calculator</h1>
          <p className="text-sm text-gray-400">CKD-EPI Creatinine Equation (2021)</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Input Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Patient Information</h2>

            <div className="space-y-4 mb-4">
              {/* Serum Creatinine Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Serum Creatinine (Scr)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      step="0.01"
                      value={ipScr}
                      onChange={(e) => setIPScr(e.target.value)}
                      placeholder="Enter value"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <select className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium text-sm">
                    <option value="mg/dl">mg/dL</option>
                  </select>
                </div>
              </div>

              {/* Age Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    className="w-full pl-9 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                    Years
                  </span>
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors flex-1">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={handleChange}
                      className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                    />
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">Male</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors flex-1">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={handleChange}
                      className="w-4 h-4 text-teal-500 focus:ring-teal-500"
                    />
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">Female</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={egfrCalc}
                className="flex-1 bg-[#009A6B] text-white py-2.5 px-4 transition-colors shadow-md text-sm hover:bg-[#008059]"
              >
                Calculate eGFR
              </Button>
              <Button
                variant={'outline'}
                onClick={clearAll}
                className="px-4 py-2.5 border border-[#009A6B] hover:border-[#008059] hover:text-[#009A6B] rounded-lg transition-colors text-sm"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">eGFR Results</h2>

            {showResult && egfr !== null ? (
              <div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-6xl font-bold text-gray-900">{egfr}</span>
                    <span className="text-gray-500 text-base">mL/min/1.73m²</span>
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
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700">Kidney Function Scale</div>
                  <div className="flex h-2.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 flex-[3]"></div>
                    <div className="bg-yellow-400 flex-[1]"></div>
                    <div className="bg-orange-500 flex-[1]"></div>
                    <div className="bg-red-500 flex-[2]"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-xs text-gray-600">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">Normal</div>
                      <div>&gt;60</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">Low</div>
                      <div>45-59</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-orange-600">Moderate</div>
                      <div>30-44</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">High Risk</div>
                      <div>&lt;30</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Calculator className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Enter patient information and click Calculate to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}