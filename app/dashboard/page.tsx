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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-2">Monitor your organization&apos;s analytics and insights</p>
            </div>
            <Button size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Filter Bar */}
        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Date Range:</span>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Studies</p>
                <p className="text-2xl font-bold text-foreground mt-3">{data?.stats?.totalCases ?? 0}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Patients</p>
                <p className="text-2xl font-bold text-foreground mt-3">{data?.stats?.totalPatients ?? 0}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-chart-2" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Analyses</p>
                <p className="text-2xl font-bold text-foreground mt-3">{data?.stats?.totalAnalyses ?? 0}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-chart-3" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg. eGFR</p>
                <p className="text-2xl font-bold text-foreground mt-3">{data?.stats?.avgEgfr ?? 0}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-chart-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Cases, Patients & Analyses</h3>
            <div style={{ height: 450 }}>
              <ResponsiveBar
                data={comparisonData}
                keys={["value"]}
                indexBy="name"
                margin={{ top: 40, right: 40, bottom: 80, left: 100 }}
                padding={0.5}
                colors={(d) => d.data.color}
                borderRadius={8}
                borderWidth={0}
                // enableDots={true}
                motionConfig="gentle"
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 16,
                  tickRotation: -40,
                  legend: "",
                  legendPosition: "middle",
                  legendOffset: 60,
                }}
                axisLeft={{
                  tickSize: 0,
                  tickPadding: 16,
                  tickRotation: 0,
                  legend: "Count",
                  legendPosition: "middle",
                  legendOffset: -70,
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
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                colors={(d) => d.data.color}
                borderWidth={3}
                borderColor="hsl(var(--card))"
                innerRadius={0.2}
                padAngle={2}
                enableArcLabels={true}
                arcLabelsTextColor="white"
                arcLabelsRadiusOffset={0.6}
                arcLabelsSkipAngle={10}
                enableArcLinkLabels={false}
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
              />
            </div>
            <div className="flex gap-8 items-center justify-center p-2">
              {severityData.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">CKD Stage Distribution</h3>
          <div style={{ height: 450 }}>
            <ResponsiveBar
              data={ckdDistribution}
              keys={["y"]}
              indexBy="x"
              margin={{ top: 40, right: 40, bottom: 80, left: 100 }}
              padding={0.5}
              colors={["hsl(var(--chart-1))"]}
              borderRadius={8}
              borderWidth={0}
              motionConfig="gentle"
              axisBottom={{
                tickSize: 0,
                tickPadding: 16,
                tickRotation: -40,
                legend: "CKD Stage",
                legendPosition: "middle",
                legendOffset: 60,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 16,
                tickRotation: 0,
                legend: "Count",
                legendPosition: "middle",
                legendOffset: -70,
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
  )
}