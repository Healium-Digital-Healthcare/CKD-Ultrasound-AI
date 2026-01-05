"use client"

import { useGetPatientTimeLineQuery } from "@/store/services/patients"
import type { EgfrTimelinePoint } from "@/types/patient"
import { ResponsiveLine } from "@nivo/line"

interface PatientOverviewProps {
  patientId: string
}

export function PatientOverview({ patientId }: PatientOverviewProps) {
  const { data = [], isLoading, isError, error } = useGetPatientTimeLineQuery(patientId)

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="bg-background rounded-xl border border-border/50 p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 mx-auto mb-4 animate-pulse" />
          <p className="text-foreground/70 text-lg">Loading patient data...</p>
        </div>
      </div>
    )
  }

  if (isError && error) {
    return (
      <div className="p-8">
        <div className="bg-background rounded-xl border border-destructive/30 p-12 text-center">
          <p className="text-destructive text-lg font-medium">Error loading patient data</p>
        </div>
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData = [
    {
      id: "eGFR",
      data: sortedData.map((point: EgfrTimelinePoint) => ({
        x: point.date,
        y: point.egfr,
      })),
    },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">eGFR Progress Over Time</h2>
        <p className="text-foreground/60">Tracking kidney function based on {data.length} study results</p>
      </div>

      {data && data.length > 0 ? (
        <>
          {/* Nivo Chart */}
          <div className="bg-background rounded-xl border border-border/50 p-6" style={{ height: "500px" }}>
            <ResponsiveLine
              data={chartData}
              margin={{ top: 50, right: 110, bottom: 80, left: 80 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
              yFormat=" >-.2f"
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 8,
                tickRotation: -45,
                legend: "Study Date",
                legendOffset: 50,
                legendPosition: "middle",
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "eGFR (mL/min/1.73m²)",
                legendOffset: -60,
                legendPosition: "middle",
              }}
              pointSize={8}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea={true}
              areaOpacity={0.15}
              colors={["#0891b2"]}
              lineWidth={3}
              isInteractive={true}
              useMesh={true}
              tooltip={({ point }: any) => (
                <div className="bg-background border border-border/50 rounded-lg p-3 shadow-lg">
                  <p className="text-sm text-foreground/60">{point.data.x}</p>
                  <p className="text-sm font-bold text-primary">{point.data.y} mL/min/1.73m²</p>
                </div>
              )}
            />
          </div>

        </>
      ) : (
        <div className="bg-background rounded-xl border border-border/50 p-12 text-center">
          <p className="text-foreground/60 text-lg">No study data available to display progress chart.</p>
          <p className="text-foreground/40 text-sm mt-2">Add studies to track eGFR changes over time.</p>
        </div>
      )}
    </div>
  )
}
