"use client"

import { Card } from "@/components/ui/card"
import type { Patient } from "@/types/patient"
import type { Case } from "@/types/case"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface PatientOverviewProps {
  patient: Patient
  cases: Case[]
}

export function PatientOverview({ patient, cases }: PatientOverviewProps) {
  const chartData = cases
    .filter((c, index) => index)
    .sort((a, b) => new Date(a.study_date).getTime() - new Date(b.study_date).getTime())
    .map((c, index) => ({
      date: new Date(c.study_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }),
      egfr: Number(index),
      study: `Study ${index + 1}`,
    }))

  return (
    <div className="p-8">
      {true ? (
        <Card className="p-8 border-gray-200 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">eGFR Progress Over Time</h2>
            <p className="text-sm text-gray-600">
              Tracking kidney function based on {chartData.length} study {chartData.length === 1 ? "result" : "results"}
            </p>
          </div>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "14px", fontWeight: 500 }} tickMargin={10} />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "14px", fontWeight: 500 }}
                  label={{
                    value: "eGFR (mL/min/1.73m²)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: "14px", fontWeight: 600, fill: "#6b7280" },
                  }}
                  tickMargin={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    color: "#111827",
                    fontWeight: 600,
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} mL/min/1.73m²`,
                    props.payload.study,
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" formatter={() => "eGFR Level"} />
                <Line
                  type="monotone"
                  dataKey="egfr"
                  stroke="#0891b2"
                  strokeWidth={4}
                  dot={{ fill: "#0891b2", r: 6, strokeWidth: 2, stroke: "white" }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card className="p-12 border-gray-200 shadow-sm text-center">
          <p className="text-gray-500 text-lg">No study data available to display progress chart.</p>
          <p className="text-gray-400 text-sm mt-2">Add studies to track eGFR changes over time.</p>
        </Card>
      )}
    </div>
  )
}
