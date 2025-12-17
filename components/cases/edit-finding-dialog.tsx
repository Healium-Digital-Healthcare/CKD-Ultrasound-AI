"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useUpdateImageAnalysisMutation } from "@/store/services/cases"
import { Loader2 } from "lucide-react"
import { AiAnalysisResult } from "@/types/case"


interface EditFindingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: AiAnalysisResult | null
  imageAnalysisId: string
  onSuccess?: () => void
}

const ETIOLOGY_OPTIONS = [
  "Medical_CKD",
  "Hydronephrosis",
  "Polycystic",
]

export function EditFindingsDialog({ open, onOpenChange, data, imageAnalysisId, onSuccess }: EditFindingsDialogProps) {
  const [editedData, setEditedData] = useState<AiAnalysisResult | null>(null)
  const [updateImageAnalysis, { isLoading }] = useUpdateImageAnalysisMutation()

  useEffect(() => {
    if (data) {
      setEditedData(JSON.parse(JSON.stringify(data)))
    }
  }, [data])

  const handleSave = async () => {
    if (!editedData) return

    try {
      await updateImageAnalysis({
        imageId: imageAnalysisId,
        ai_analysis_result: editedData,
      }).unwrap()

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      // Optionally show error toast
    }
  }

  if (!editedData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col bg-background">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl">Edit Analysis Results</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Review and adjust AI-generated findings
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Accordion
            type="multiple"
            defaultValue={["ckd", "egfr", "findings", "etiology", "notes"]}
            className="space-y-2"
          >
            {/* CKD Assessment Section */}
            <AccordionItem value="ckd" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-sm font-semibold uppercase tracking-wide">CKD Assessment</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="ckd-risk"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      Risk Level
                    </Label>
                    <Select
                      value={editedData.ckdRisk}
                      onValueChange={(value) => setEditedData({ ...editedData, ckdRisk: value as "LOW" | "HIGH" | "MODERATE"})}
                    >
                      <SelectTrigger id="ckd-risk" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="ckd-stage"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      CKD Stage
                    </Label>
                    <Select
                      value={editedData.ckdStage}
                      onValueChange={(value) => setEditedData({ ...editedData, ckdStage: value })}
                    >
                      <SelectTrigger id="ckd-stage" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stage 1">Stage 1</SelectItem>
                        <SelectItem value="Stage 2">Stage 2</SelectItem>
                        <SelectItem value="Stage 3a">Stage 3a</SelectItem>
                        <SelectItem value="Stage 3b">Stage 3b</SelectItem>
                        <SelectItem value="Stage 4">Stage 4</SelectItem>
                        <SelectItem value="Stage 5">Stage 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* eGFR Prediction Section */}
            <AccordionItem value="egfr" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-sm font-semibold uppercase tracking-wide">eGFR Prediction</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-3 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="egfr-value"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      eGFR Value
                    </Label>
                    <Input
                      id="egfr-value"
                      type="number"
                      value={editedData.egfr}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          egfr: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="egfr-confidence"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      Confidence (%)
                    </Label>
                    <Input
                      id="egfr-confidence"
                      type="number"
                      value={editedData.confidence}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          confidence: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="egfr-range"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      Range
                    </Label>
                    <Input
                      id="egfr-range"
                      value={editedData.range}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          range: e.target.value,
                        })
                      }
                      placeholder="e.g. 38-46"
                      className="h-10"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Structural Findings Section */}
            <AccordionItem value="findings" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-sm font-semibold uppercase tracking-wide">Structural Findings</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-2 gap-6 pt-2">
                  {editedData.findings.map((finding, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label
                        htmlFor={`finding-${idx}`}
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
                      >
                        {finding.name}
                      </Label>
                      <Select
                        value={finding.severity}
                        onValueChange={(value) => {
                          const newFindings = [...editedData.findings]
                          newFindings[idx] = {
                            ...newFindings[idx],
                            severity: value,
                            hasIssue: value !== "None",
                          }
                          setEditedData({ ...editedData, findings: newFindings })
                        }}
                      >
                        <SelectTrigger id={`finding-${idx}`} className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Mild">Mild</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Probable Etiology Section */}
            <AccordionItem value="etiology" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-sm font-semibold uppercase tracking-wide">Probable Etiology</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 pt-2">
                  {ETIOLOGY_OPTIONS.map((etiologyName) => {
                    const existingEtiology = editedData.etiology.find((e) => e.name === etiologyName)
                    const percentage = existingEtiology?.percentage || 0

                    return (
                      <div key={etiologyName} className="grid grid-cols-[1fr_120px] gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {etiologyName}
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={percentage}
                            onChange={(e) => {
                              const newPercentage = Number.parseFloat(e.target.value) || 0
                              const existingIndex = editedData.etiology.findIndex((et) => et.name === etiologyName)

                              let newEtiology = [...editedData.etiology]
                              if (existingIndex >= 0) {
                                newEtiology[existingIndex] = { name: etiologyName, percentage: newPercentage }
                              } else {
                                newEtiology.push({ name: etiologyName, percentage: newPercentage })
                              }

                              // Filter out zero percentages
                              newEtiology = newEtiology.filter((e) => e.percentage > 0)

                              setEditedData({ ...editedData, etiology: newEtiology })
                            }}
                            placeholder="0"
                            className="h-10"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Clinical Notes Section */}
            <AccordionItem value="notes" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-sm font-semibold uppercase tracking-wide">Clinical Notes</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-2 pt-2">
                  <Label htmlFor="notes" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Additional Observations
                  </Label>
                  <Textarea
                    id="notes"
                    value={editedData.notes || ""}
                    onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                    rows={5}
                    placeholder="Add clinical observations, additional findings, or notes..."
                    className="resize-none"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border-t pt-4 flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-10" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 h-10" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
