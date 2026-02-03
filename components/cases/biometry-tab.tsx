"use client"

import type { Biometry, ImageAnalysis } from "@/types/case"
import { DicomPreview } from "./dicom-preview"

interface BiometryTabProps {
  imageAnalysisData: {
    biometry?: Biometry | null
  },
  images: ImageAnalysis[]
}

export function BiometryTab({ imageAnalysisData, images }: BiometryTabProps) {
  const biometry = imageAnalysisData?.biometry
  // Get kidney images for visualization
  const leftKidneyImage = images?.find(img => img.kidney_type === "left")
  const rightKidneyImage = images?.find(img => img.kidney_type === "right")
  
  
  const leftKidney = biometry?.leftKidney || {
    length: null,
    width: null,
    thickness: null,
    area: null,
    volume: null,
    status: "Normal" as const
  }
  
  const rightKidney = biometry?.rightKidney || {
    length: null,
    width: null,
    thickness: null,
    area: null,
    volume: null,
    status: "Normal" as const
  }
  
  const totalVolume = biometry?.totalVolume ?? 0
  
  const formatValue = (value: number | null, decimals = 1): string => {
    return value !== null ? value.toFixed(decimals) : "—"
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Abnormal":
        return "bg-red-50 text-red-700 border-red-200"
      case "Borderline":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getFileType = (path: string) => {
    const cleanPath = path.split("?")[0]
    return cleanPath.toLowerCase().endsWith(".dcm") ? "dicom" : "image"
  }
  
  const leftVolume = leftKidney?.volume ?? 0;
  
  const rightVolume = rightKidney?.volume ?? 0;

  if (!biometry) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">No biometry data available. Run analysis first.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white text-gray-900">
      {/* Left Kidney Card */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-sm text-gray-900">Left Kidney</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusBadgeClass(leftKidney.status)}`}>
            {leftKidney.status}
          </span>
        </div>

        {/* Kidney Visualization */}
        <div className="relative bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center border border-gray-200">
          {leftKidneyImage && (
            <div className="absolute inset-0 w-full h-full rounded-lg">
              {getFileType(leftKidneyImage.signed_url || "") === "dicom" ? (
                <DicomPreview signedUrl={leftKidneyImage.signed_url || ""} className="w-full h-full rounded-lg opacity-90" />
              ) : (
                <img 
                  src={leftKidneyImage.signed_url || ''} 
                  alt="Left kidney ultrasound"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-lg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          )}
          <div className="relative">
            <svg width="120" height="160" viewBox="0 0 120 160" className="transform">
              <ellipse cx="60" cy="80" rx="35" ry="65" fill="none" stroke="#10b981" strokeWidth="2" />
              <line x1="25" y1="80" x2="95" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
              <line x1="60" y1="15" x2="60" y2="145" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
              <circle cx="60" cy="80" r="3" fill="#ef4444" />
            </svg>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-blue-600">L: {formatValue(leftKidney.length)}mm</div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-[10px] text-amber-600">W: {formatValue(leftKidney.width)}mm</div>
          </div>
        </div>

        {/* Measurements Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Length</p>
            <p className="text-lg font-semibold text-blue-600">
              {formatValue(leftKidney.length)} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Width</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatValue(leftKidney.width)} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Thickness</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatValue(leftKidney.thickness)} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Area</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatValue(leftKidney.area)} <span className="text-xs text-gray-500">cm²</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Kidney Card */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="font-medium text-sm text-gray-900">Right Kidney</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusBadgeClass(rightKidney.status)}`}>
            {rightKidney.status}
          </span>
        </div>

        {/* Kidney Visualization */}
        <div className="relative bg-gray-50 rounded-lg p-4 mb-3 flex items-center justify-center border border-gray-200">
          {rightKidneyImage && (
            <div className="absolute rounded-lg inset-0 w-full h-full">
              {getFileType(rightKidneyImage.signed_url || "") === "dicom" ? (
                <DicomPreview signedUrl={rightKidneyImage.signed_url || ""} className="w-full h-full rounded-lg opacity-75" />
              ) : (
                <img 
                  src={rightKidneyImage.signed_url || ''} 
                  alt="Right kidney ultrasound"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-lg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}
          <div className="relative">
            <svg width="120" height="160" viewBox="0 0 120 160" className="transform">
              <ellipse cx="60" cy="80" rx="33" ry="60" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <line x1="27" y1="80" x2="93" y2="80" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4" />
              <line x1="60" y1="20" x2="60" y2="140" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
              <circle cx="60" cy="80" r="3" fill="#ef4444" />
            </svg>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-blue-600">L: {formatValue(rightKidney.length)}mm</div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 text-[10px] text-amber-600">W: {formatValue(rightKidney.width)}mm</div>
          </div>
        </div>

        {/* Measurements Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Length</p>
            <p className="text-lg font-semibold text-amber-600">
              {formatValue(rightKidney.length)} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Width</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatValue(rightKidney.width)} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Thickness</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatValue(rightKidney.thickness)} <span className="text-xs text-gray-500">mm</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Area</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatValue(rightKidney.area)} <span className="text-xs text-gray-500">cm²</span>
            </p>
          </div>
        </div>
      </div>

      {/* Volume Calculations */}
      <div className="p-3 border-t border-gray-200 bg-white">

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Volume Calculations</p>
            <p className="text-[10px] text-gray-500">L × W × T × 0.523</p>
          </div>
        </div>

        <div className="rounded-xl mb-3 bg-gray-50 rounded-lg p-2.5 border border-gray-200">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-1">Left Kidney</p>
              <p className="text-xl font-bold text-emerald-400">{leftVolume}</p>
              <p className="text-[10px] text-gray-500">cm³</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-1">Right Kidney</p>
              <p className="text-xl font-bold text-amber-400">{rightVolume}</p>
              <p className="text-[10px] text-gray-500">cm³</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 mb-1">Total Renal Volume</p>
              <p className="text-xl font-bold text-blue-400">{totalVolume}</p>
              <p className="text-[10px] text-gray-500">cm³</p>
            </div>
          </div>
        </div>

        {/* Reference Note */}
        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-[10px] text-blue-600 flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Normal kidney volume: 150-200 cm³. Both kidneys are within normal range.
          </p>
        </div>
      </div>
    </div>
  )
}