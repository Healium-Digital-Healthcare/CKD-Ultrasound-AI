"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Filter, FileText, Users, Activity, TrendingUp } from "lucide-react"
import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"
import { useGetDashboardStatsQuery } from "@/store/services/organization"
import DashboardSkeleton from "@/components/organization/dashboard-skeleton"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("last_30_days")

  // API call
  const { data, isLoading, refetch, isFetching } = useGetDashboardStatsQuery(
    { params: { date_range: dateRange } },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  // Prepare charts data safely
  const severityData = useMemo(() => {
    if (!data?.severityData) return []
    return data.severityData.map((d: any) => ({
      id: d.name,
      label: d.name,
      value: d.value,
      color: d.color,
    }))
  }, [data])

  const ckdDistribution = useMemo(() => {
    if (!data?.ckdDistribution) return []
    return data.ckdDistribution.map((d: any) => ({
      x: d.ckdStage,
      y: d.count,
    }))
  }, [data])

  const comparisonData = useMemo(() => {
    if (!data?.stats) return []
    return [
      { name: "Cases", value: data.stats.totalCases, color: "hsl(var(--chart-1))" },
      { name: "Patients", value: data.stats.totalPatients, color: "hsl(var(--chart-2))" },
      { name: "Analyses", value: data.stats.totalAnalyses, color: "hsl(var(--chart-3))" },
    ]
  }, [data])

  return isLoading || isFetching ? (
    <DashboardSkeleton />
  ) : (
    <div className="flex flex-col h-full">
      <div className="">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitor your organization's analytics and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
              <SelectTrigger className="w-32 h-9 text-sm bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="last_30_days">Last 30 days</SelectItem>
                <SelectItem value="last_90_days">Last 90 days</SelectItem>
                <SelectItem value="last_year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => refetch()}
              className="gap-2 h-9 bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-4 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Studies</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{data?.stats?.totalCases ?? 0}</p>
                </div>
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Patients</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{data?.stats?.totalPatients ?? 0}</p>
                </div>
                <div className="w-8 h-8 rounded bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-chart-2" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Analyses</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{data?.stats?.totalAnalyses ?? 0}</p>
                </div>
                <div className="w-8 h-8 rounded bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-chart-3" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg. eGFR</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{data?.stats?.avgEgfr ?? 0}</p>
                </div>
                <div className="w-8 h-8 rounded bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-chart-4" />
                </div>
              </div>
            </div>
          </div>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-foreground p-6">Cases, Patients & Analyses</h3>
              <div style={{ height: 450 }} className="">
                <ResponsiveBar
                  data={comparisonData}
                  keys={["value"]}
                  indexBy="name"
                  margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
                  padding={0.5}
                  colors={(d) => d.data.color}
                  borderRadius={2}
                  borderWidth={0}
                  motionConfig="gentle"
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: 60,
                  }}
                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickRotation: 0,
                  }}
                  enableLabel={true}
                  label={(d) => `${d.value}`}
                  labelSkipWidth={0}
                  labelSkipHeight={0}
                  labelTextColor="hsl(var(--foreground))"
                  tooltip={({ value, data }) => (
                    <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-foreground">{data.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{value}</p>
                    </div>
                  )}
                  theme={{
                    axis: {
                      domain: { line: { stroke: "transparent" } },
                      legend: { text: { fontSize: 13, fill: "hsl(var(--foreground))" } },
                      ticks: { line: { stroke: "transparent" } },
                    },
                    grid: { line: { stroke: "hsl(var(--border))", strokeWidth: 1 } },
                    labels: { text: { fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700 } },
                    tooltip: { container: { background: "transparent", border: "none" } },
                  }}
                />
              </div>
            </div>

            {/* Pie Chart - Equal Size */}
            <div className="bg-card border border-border rounded-lg">
              <h3 className="text-lg font-semibold text-foreground p-6">Patient Severity Distribution</h3>
              <div style={{ height: 400 }}>
                <ResponsivePie
                  data={severityData}
                  margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
                  colors={(d) => d.data.color}
                  borderWidth={3}
                  borderColor="hsl(var(--card))"
                  innerRadius={0.7}
                  padAngle={0}
                  enableArcLabels={true}
                  arcLabelsTextColor="white"
                  arcLabelsRadiusOffset={0.6}
                  arcLabelsSkipAngle={10}
                  enableArcLinkLabels={false}
                  cornerRadius={0}
                  animate={true}
                  motionConfig="wobbly"
                  tooltip={({ datum }) => (
                    <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-foreground">{datum.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{datum.value}</p>
                    </div>
                  )}
                  theme={{
                    labels: { text: { fontSize: 14, fontWeight: 700 } },
                    tooltip: { container: { background: "transparent", border: "none" } },
                  }}
                  legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 56,
                        translateX: 20,
                        itemWidth: 100,
                        itemHeight: 18,
                        symbolShape: 'circle'
                    }
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold text-foreground p-6">CKD Stage Distribution</h3>
            <div style={{ height: 450 }}>
              <ResponsiveBar
                data={ckdDistribution}
                keys={["y"]}
                indexBy="x"
                margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
                padding={0.5}
                colors={["hsl(var(--chart-1))"]}
                borderRadius={2}
                borderWidth={0}
                motionConfig="gentle"
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 16,
                  tickRotation: 0,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 16,
                  tickRotation: 0,
                }}
                enableLabel={true}
                label={(d) => `${d.value}`}
                labelSkipWidth={0}
                labelSkipHeight={0}
                labelTextColor="hsl(var(--foreground))"
                tooltip={({ value, data }) => (
                  <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-foreground">{data.x}</p>
                    <p className="text-sm text-muted-foreground mt-1">{value}</p>
                  </div>
                )}
                theme={{
                  axis: {
                    domain: { line: { stroke: "transparent" } },
                    legend: { text: { fontSize: 13, fill: "hsl(var(--foreground))" } },
                    ticks: { line: { stroke: "transparent" } },
                  },
                  grid: { line: { stroke: "hsl(var(--border))", strokeWidth: 1 } },
                  labels: { text: { fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700 } },
                  tooltip: { container: { background: "transparent", border: "none" } },
                }}
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}