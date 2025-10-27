"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PatientInput {
  patient_id: string
  patient_name: string
  age: string
  gender: string
  scanned_on: Date
}

export default function NewCasePage() {
  const router = useRouter()
  const [patientType, setPatientType] = useState<"New Patient" | "Existing Patient" | "">("")
  const [showSearch, setShowSearch] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; path: string; nameInfo: string }>>([])
  const [input, setInput] = useState<PatientInput>({
    patient_id: "",
    patient_name: "",
    age: "",
    gender: "Male",
    scanned_on: new Date(),
  })

  useEffect(() => {
    if (patientType === "New Patient") {
      // Auto-generate patient ID for new patients
      const generatedId = `PID${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${Math.floor(Math.random() * 1000)}`
      setInput({ ...input, patient_id: generatedId, patient_name: "", age: "", gender: "Male" })
      setShowSearch(false)
    } else if (patientType === "Existing Patient") {
      setInput({ ...input, patient_id: "", patient_name: "", age: "", gender: "Male" })
      setShowSearch(false)
    }
  }, [patientType])

  const selectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const images: Array<{ file: File; path: string; nameInfo: string }> = []
    for (let i = 0; i < files.length; i++) {
      images.push({
        file: files[i],
        path: URL.createObjectURL(files[i]),
        nameInfo: files[i].name,
      })
    }
    setUploadedImages(images)
  }

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
  }

  const findPatient = () => {
    // Mock patient search - in real app, this would call an API
    if (input.patient_id) {
      // Simulate finding a patient
      setInput({
        ...input,
        patient_name: "John Doe",
        age: "45",
        gender: "Male",
      })
      setShowSearch(true)
    }
  }

  const handleSubmit = () => {
    // Validation
    if (!patientType) {
      alert("Please select patient type")
      return
    }
    if (!input.patient_id || !input.patient_name || !input.age || uploadedImages.length === 0) {
      alert("Please fill all required fields and upload at least one image")
      return
    }

    // In real app, this would submit to API
    console.log("Submitting case:", { patientType, input, images: uploadedImages.length })

    // Navigate to cases list
    router.push("/cases")
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Patient Type Selection */}
        <div className="bg-black border border-white/10 rounded-lg mt-10">
          <div className="flex gap-8 w-[90%] mx-auto pt-10">
            <div className="text-white text-[17px]">New Patient</div>
            <input
              type="radio"
              className="mt-1.5 cursor-pointer"
              checked={patientType === "New Patient"}
              onChange={() => setPatientType("New Patient")}
            />
            <div className="text-white text-[17px]">Existing Patient</div>
            <input
              type="radio"
              className="mt-1.5 cursor-pointer"
              checked={patientType === "Existing Patient"}
              onChange={() => setPatientType("Existing Patient")}
            />
          </div>

          {/* Patient Information Form */}
          {patientType === "Existing Patient" ? (
            <>
              <div className="flex ml-[5%] mt-10 gap-3 md:gap-[3.5rem] flex-wrap">
                <div className="text-white text-[17px]">Patient ID</div>
                <div>
                  <input
                    value={input.patient_id}
                    onChange={(e) => setInput({ ...input, patient_id: e.target.value })}
                    className="w-[150px] outline-none h-8 rounded-sm pl-2 text-black"
                    placeholder="Enter Patient ID"
                  />
                </div>
                {showSearch ? (
                  <>
                    <div className="text-white text-[17px]">Patient Name</div>
                    <div>
                      <input
                        readOnly
                        value={input.patient_name}
                        className="w-[150px] outline-none h-8 rounded-sm pl-2 text-black bg-gray-200"
                      />
                    </div>
                    <div className="text-white text-[17px]">Age</div>
                    <div>
                      <input
                        readOnly
                        value={input.age}
                        className="w-[150px] outline-none h-8 rounded-sm pl-2 text-black bg-gray-200"
                      />
                    </div>
                    <div className="text-white text-[17px]">Sex</div>
                    <div>
                      <select
                        value={input.gender}
                        disabled
                        className="w-[80px] outline-none h-8 rounded-sm text-black bg-gray-200"
                      >
                        <option>{input.gender}</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <Button onClick={findPatient} className="bg-blue-500 text-white px-8 rounded hover:bg-blue-600">
                    Find
                  </Button>
                )}
              </div>
              <div className="flex ml-[5%] mt-10 gap-3 md:gap-[3.5rem] flex-wrap pb-6">
                <div className="text-white text-[17px] whitespace-nowrap">Scan Date</div>
                <input
                  type="date"
                  value={input.scanned_on.toISOString().split("T")[0]}
                  onChange={(e) => setInput({ ...input, scanned_on: new Date(e.target.value) })}
                  className="w-[150px] outline-none h-8 rounded-sm pl-3 text-black"
                />
              </div>
            </>
          ) : patientType === "New Patient" ? (
            <>
              <div className="flex ml-[5.5%] mt-10 gap-3 md:gap-[3.5rem] flex-wrap">
                <div className="text-white text-[17px]">Patient ID</div>
                <div>
                  <input
                    value={input.patient_id}
                    disabled
                    className="w-[150px] outline-none h-8 rounded-sm pl-2 text-black bg-gray-200"
                  />
                </div>
                <div className="text-white text-[17px]">Patient Name</div>
                <div>
                  <input
                    value={input.patient_name}
                    onChange={(e) => setInput({ ...input, patient_name: e.target.value })}
                    className="w-[150px] outline-none h-8 rounded-sm pl-2 text-black"
                    placeholder="Enter name"
                  />
                </div>
                <div className="text-white text-[17px]">Age</div>
                <div>
                  <input
                    value={input.age}
                    onChange={(e) => setInput({ ...input, age: e.target.value })}
                    type="number"
                    className="w-[150px] outline-none h-8 rounded-sm pl-2 text-black"
                    placeholder="Enter age"
                  />
                </div>
                <div className="text-white text-[17px]">Sex</div>
                <div>
                  <select
                    value={input.gender}
                    onChange={(e) => setInput({ ...input, gender: e.target.value })}
                    className="w-[80px] outline-none h-8 rounded-sm text-black"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="flex ml-[5.5%] mt-10 gap-3 md:gap-[3.5rem] flex-wrap pb-6">
                <div className="text-white text-[17px] whitespace-nowrap">Scan Date</div>
                <input
                  type="date"
                  value={input.scanned_on.toISOString().split("T")[0]}
                  onChange={(e) => setInput({ ...input, scanned_on: new Date(e.target.value) })}
                  className="w-[150px] outline-none h-8 rounded-sm pl-3 text-black"
                />
              </div>
            </>
          ) : null}

          {/* Image Upload Section */}
          {patientType && (
            <>
              <div className="flex justify-center m-auto pt-10 w-[90%]">
                <div className="border border-white rounded-lg w-full md:w-[50%] h-[90px]">
                  <label htmlFor="actual-btn" className="flex gap-5 mt-2 cursor-pointer justify-center">
                    <div className="w-[15%]">
                      <Upload className="h-10 w-10 mt-4 ml-5 text-white" />
                      <input
                        multiple
                        accept="image/png,image/jpeg,image/jpg,.dcm"
                        type="file"
                        id="actual-btn"
                        onChange={selectFiles}
                        hidden
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm pt-6 font-normal tracking-wide">
                        Upload PNG, JPEG Files or DICOM Files
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Preview Grid */}
              <div className="flex gap-6 mt-10 m-auto w-[90%] flex-wrap pb-10">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      className="h-[134px] w-[177px] object-cover rounded border border-white/20"
                      src={image.path || "/placeholder.svg"}
                      alt={`uploaded_image_${index}`}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-white text-xs mt-1 truncate w-[177px]">{image.nameInfo}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="fixed bottom-0 right-0 z-20">
        <button
          onClick={handleSubmit}
          className="text-white bg-black border-t border-l border-white/20 w-[200px] text-center h-[3rem] rounded-tl-full cursor-pointer tracking-wider hover:bg-[#009A6B] transition-colors font-medium"
        >
          PROCEED
        </button>
      </div>
    </div>
  )
}
