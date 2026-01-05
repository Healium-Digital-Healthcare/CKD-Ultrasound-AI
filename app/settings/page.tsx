"use client"

import { useState } from "react"
import { Building, Server, Lock } from "lucide-react"
import { OrganizationTab } from "@/components/setting/organization-detail"
import { PacsIntegrationTab } from "@/components/setting/pacs-integration"
import { SecurityTab } from "@/components/setting/security-update"

export default function OrganizationSettingsPage() {
  const [activeTab, setActiveTab] = useState<"organization" | "pacs" | "security">("organization")

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {activeTab === "organization" && "Organization Settings"}
            {activeTab === "pacs" && "PACS Integration"}
            {activeTab === "security" && "Security & Authentication"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "organization" && "Manage your organization profile"}
            {activeTab === "pacs" && "Configure PACS server connections and DICOM settings"}
            {activeTab === "security" && "Configure security policies, 2FA, and access controls"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("organization")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "organization"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Building className="w-4 h-4 inline mr-2" />
            Organization
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab("pacs")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "pacs"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Server className="w-4 h-4 inline mr-2" />
            PACS Integration
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "organization" && <OrganizationTab />}
      {activeTab === "pacs" && <PacsIntegrationTab />}
      {activeTab === "security" && <SecurityTab />}
    </div>
  )
}
