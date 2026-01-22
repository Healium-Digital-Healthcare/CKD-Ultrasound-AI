"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TestTube, Save, Server, Link2, Shield, Database } from "lucide-react"

export function PacsIntegrationTab() {
  const [pacsConfig, setPacsConfig] = useState({
    serverUrl: "pacs.hospital.com",
    port: "11112",
    aeTitle: "KIDNEY_AI",
    callingAeTitle: "WORKSTATION",
    username: "admin",
    password: "",
    protocol: "dicom",
    autoUpload: true,
    retryAttempts: "3",
    timeout: "30",
  })

  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  const handlePacsSave = () => {
    console.log("Saving PACS config:", pacsConfig)
    alert("PACS configuration saved successfully!")
  }

  const handlePacsTest = async () => {
    setTestStatus("testing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setTestStatus("success")
    setTimeout(() => setTestStatus("idle"), 3000)
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">PACS Integration</h2>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${pacsConfig.autoUpload ? "bg-green-500" : "bg-gray-400"}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {pacsConfig.autoUpload ? "Auto-upload Enabled" : "Auto-upload Disabled"}
              </p>
              <p className="text-xs text-gray-500">Last sync: 2 hours ago</p>
            </div>
          </div>
          {testStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Server Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="server-url">PACS Server URL</Label>
              <Input
                id="server-url"
                value={pacsConfig.serverUrl}
                onChange={(e) => setPacsConfig({ ...pacsConfig, serverUrl: e.target.value })}
                placeholder="pacs.hospital.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={pacsConfig.port}
                onChange={(e) => setPacsConfig({ ...pacsConfig, port: e.target.value })}
                placeholder="11112"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="protocol">Protocol</Label>
              <Select
                value={pacsConfig.protocol}
                onValueChange={(value) => setPacsConfig({ ...pacsConfig, protocol: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dicom">DICOM</SelectItem>
                  <SelectItem value="dicomweb">DICOMweb</SelectItem>
                  <SelectItem value="hl7">HL7 FHIR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
              <Input
                id="timeout"
                value={pacsConfig.timeout}
                onChange={(e) => setPacsConfig({ ...pacsConfig, timeout: e.target.value })}
                placeholder="30"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">DICOM Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ae-title">AE Title</Label>
              <Input
                id="ae-title"
                value={pacsConfig.aeTitle}
                onChange={(e) => setPacsConfig({ ...pacsConfig, aeTitle: e.target.value })}
                placeholder="KIDNEY_AI"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">Application Entity title for this system</p>
            </div>

            <div>
              <Label htmlFor="calling-ae-title">Calling AE Title</Label>
              <Input
                id="calling-ae-title"
                value={pacsConfig.callingAeTitle}
                onChange={(e) => setPacsConfig({ ...pacsConfig, callingAeTitle: e.target.value })}
                placeholder="WORKSTATION"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">AE title of the calling workstation</p>
            </div>

            <div>
              <Label htmlFor="retry-attempts">Retry Attempts</Label>
              <Input
                id="retry-attempts"
                value={pacsConfig.retryAttempts}
                onChange={(e) => setPacsConfig({ ...pacsConfig, retryAttempts: e.target.value })}
                placeholder="3"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Authentication</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pacs-username">Username</Label>
              <Input
                id="pacs-username"
                value={pacsConfig.username}
                onChange={(e) => setPacsConfig({ ...pacsConfig, username: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="pacs-password">Password</Label>
              <Input
                id="pacs-password"
                type="password"
                value={pacsConfig.password}
                onChange={(e) => setPacsConfig({ ...pacsConfig, password: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="auto-upload"
            checked={pacsConfig.autoUpload}
            onChange={(e) => setPacsConfig({ ...pacsConfig, autoUpload: e.target.checked })}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <div>
            <Label htmlFor="auto-upload" className="font-medium cursor-pointer">
              Enable automatic upload from PACS
            </Label>
            <p className="text-xs text-gray-500 mt-0.5">Automatically pull new imaging studies from the PACS server</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button onClick={handlePacsTest} variant="outline" disabled={testStatus === "testing"}>
            <TestTube className="w-4 h-4 mr-2" />
            {testStatus === "testing"
              ? "Testing..."
              : testStatus === "success"
                ? "Connection Successful!"
                : "Test Connection"}
          </Button>

          <Button onClick={handlePacsSave} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </Card>
  )
}
