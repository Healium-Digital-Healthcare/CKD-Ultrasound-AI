"use client"

import { useMemo, useState } from "react"
import { AlertCircle, Calendar, Clock3, Search, TrendingDown, TrendingUp, Users } from "lucide-react"
import { useGetTodayStatsQuery } from "@/store/services/organization"
import { useGetCasesQuery } from "@/store/services/cases"
import { useGetPatientsQuery } from "@/store/services/patients"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const STAGE_COLORS: Record<string, string> = {
  "Stage 1": "#2f8ec4",
  "Stage 2": "#ef7a75",
  "Stage 3": "#26b2ce",
  "Stage 4": "#a4aab2",
  "Stage 5": "#dd5c4e",
}

function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (!Number.isFinite(Number(percent)) || Number(percent) <= 0) {
    return null
  }

  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.62
  const x = Number(cx) + radius * Math.cos((-midAngle * Math.PI) / 180)
  const y = Number(cy) + radius * Math.sin((-midAngle * Math.PI) / 180)

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${Math.round(Number(percent || 0) * 100)}%`}
    </text>
  )
}

function BarValueLabel({ x, y, width, value }: any) {
  const barX = Number(x ?? 0)
  const barY = Number(y ?? 0)
  const barWidth = Number(width ?? 0)
  const numericValue = Number(value ?? 0)

  if (numericValue <= 0) {
    return null
  }

  const labelText = `${numericValue}`
  const labelWidth = 30
  const labelHeight = 20
  const offsetX = barWidth / 2 - labelWidth / 2
  const offsetY = -22

  return (
    <g transform={`translate(${barX + offsetX}, ${barY + offsetY})`}>
      <rect width={labelWidth} height={labelHeight} rx={8} ry={8} fill="#ffffff" stroke="#d9e6f1" />
      <text x={labelWidth / 2} y={labelHeight / 2 + 4} textAnchor="middle" fill="#6b7885" fontSize={11} fontWeight={600}>
        {labelText}
      </text>
    </g>
  )
}

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
  trendType: "up" | "down"
  chips?: string[]
}

function MetricCard({ title, value, icon, trend, trendType, chips }: MetricCardProps) {
  const isUp = trendType === "up"

  return (
    <div className="rounded-[24px] bg-[#E9F6FD] backdrop-blur-[4px] border border-[#c9dcec] p-4 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_24px_rgba(113,147,176,0.16)]">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm leading-tight font-semibold text-[#0f6ca2]">{title}</h3>
        <div className="h-8 w-8 rounded-full bg-[#e8f2f9] border border-[#bfd4e4] flex items-center justify-center text-[#2d89c0]">
          {icon}
        </div>
      </div>

      <p className="text-2xl leading-none font-bold text-[#6a6f76]">{value}</p>
      <div className="h-px bg-[#c9d9e7] mt-3 mb-2" />

      {chips ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Badge
              key={chip}
              variant="outline"
              className="rounded-full border-[#b9d4e7] bg-[#edf5fb] text-[#318dbf] text-xs font-semibold"
            >
              {chip}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge
          variant="outline"
          className="rounded-full border-[#f0b7b2] bg-[#f8efee] text-[#dc6d66] text-xs font-semibold"
        >
          <span className="mr-1">{isUp ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}</span>
          {trend}
        </Badge>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [screeningRange, setScreeningRange] = useState<"week" | "month">("week")
  const [ckdRange, setCkdRange] = useState<"week" | "month">("week")
  const [genderRange, setGenderRange] = useState<"week" | "month">("week")
  const [stageRange, setStageRange] = useState<"week" | "month">("week")
  const [severityFilter, setSeverityFilter] = useState<"Critical" | "Moderate" | "Low">("Critical")

  const { data: todayStats } = useGetTodayStatsQuery()
  const { data: screeningCasesData } = useGetCasesQuery({ params: { page: 1, limit: 10000, range: screeningRange } })
  const { data: ckdCasesData } = useGetCasesQuery({ params: { page: 1, limit: 10000, range: ckdRange } })
  const { data: genderCasesData } = useGetCasesQuery({ params: { page: 1, limit: 10000, range: genderRange } })
  const { data: stageCasesData } = useGetCasesQuery({ params: { page: 1, limit: 10000, range: stageRange } })
  const { data: trendCasesData } = useGetCasesQuery({ params: { page: 1, limit: 10000, range: "week" } })
  const { data: patientsData } = useGetPatientsQuery({ params: { page: 1, limit: 1 } })

  const screeningCases = useMemo(() => screeningCasesData?.data ?? [], [screeningCasesData])
  const ckdCases = useMemo(() => ckdCasesData?.data ?? [], [ckdCasesData])
  const genderCases = useMemo(() => genderCasesData?.data ?? [], [genderCasesData])
  const stageCases = useMemo(() => stageCasesData?.data ?? [], [stageCasesData])
  const trendCases = useMemo(() => trendCasesData?.data ?? [], [trendCasesData])

  const weeklyScreenings = useMemo(() => {
    if (screeningRange === "week") {
      const counts = new Map<string, number>(DAY_ORDER.map((d) => [d, 0]))

      for (const c of screeningCases) {
        const date = new Date(c.study_date)
        const day = DAY_ORDER[date.getDay()]
        counts.set(day, (counts.get(day) || 0) + 1)
      }

      const values = DAY_ORDER.map((day) => counts.get(day) || 0)
      const maxValue = Math.max(5, ...values)
      const roundedMax = Math.ceil(maxValue / 5) * 5

      return DAY_ORDER.map((day) => ({
        day,
        value: counts.get(day) || 0,
        max: roundedMax,
      }))
    }

    const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
    const weekCounts = [0, 0, 0, 0, 0]
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    const start = new Date(end)
    start.setDate(end.getDate() - 29)
    start.setHours(0, 0, 0, 0)

    for (const c of screeningCases) {
      const d = new Date(c.study_date)
      if (d < start || d > end) continue

      const dayMs = 24 * 60 * 60 * 1000
      const diffDays = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - start.getTime()) / dayMs)
      const weekIndex = Math.min(4, Math.floor(diffDays / 7))
      weekCounts[weekIndex] += 1
    }

    const maxValue = Math.max(5, ...weekCounts)
    const roundedMax = Math.ceil(maxValue / 5) * 5

    return WEEK_LABELS.map((label, idx) => ({
      day: label,
      value: weekCounts[idx],
      max: roundedMax,
    }))
  }, [screeningCases, screeningRange])

  const ckdDistribution = useMemo(() => {
    const stageCounts: Record<string, number> = {
      "Stage 1": 0,
      "Stage 2": 0,
      "Stage 3": 0,
      "Stage 4": 0,
      "Stage 5": 0,
    }

    for (const c of ckdCases) {
      let detectedStage = ""
      for (const img of c.images || []) {
        const stage = img.ai_analysis_result?.ckdStage
        if (stage && stage.trim()) {
          detectedStage = stage
          break
        }
      }

      if (!detectedStage) continue

      if (detectedStage.includes("1")) stageCounts["Stage 1"] += 1
      else if (detectedStage.includes("2")) stageCounts["Stage 2"] += 1
      else if (detectedStage.toLowerCase().includes("3")) stageCounts["Stage 3"] += 1
      else if (detectedStage.includes("4")) stageCounts["Stage 4"] += 1
      else if (detectedStage.includes("5")) stageCounts["Stage 5"] += 1
    }

    return Object.entries(stageCounts).map(([label, value]) => ({
      label,
      value,
      color: STAGE_COLORS[label],
    }))
  }, [ckdCases])

  const hasCkdData = useMemo(() => ckdDistribution.some((item) => item.value > 0), [ckdDistribution])

  const genderStats = useMemo(() => {
    const femaleSet = new Set<string>()
    const maleSet = new Set<string>()

    for (const c of genderCases) {
      const sex = (c.patient?.sex || "").toUpperCase()
      if (sex.startsWith("F")) femaleSet.add(c.patient_id)
      if (sex.startsWith("M")) maleSet.add(c.patient_id)
    }

    const female = femaleSet.size
    const male = maleSet.size
    const total = female + male

    const femalePct = total > 0 ? Math.round((female / total) * 100) : 0
    const malePct = total > 0 ? 100 - femalePct : 0

    return {
      total,
      female,
      male,
      femalePct,
      malePct,
      data: [
        { name: "Female", value: female || 0, color: "#35b5d2" },
        { name: "Male", value: male || 0, color: "#2f8ec4" },
      ],
    }
  }, [genderCases])

  const stageRiskValue = severityFilter === "Critical" ? "HIGH" : severityFilter === "Moderate" ? "MODERATE" : "LOW"

  const ckdStageSeries = useMemo(() => {
    if (stageRange === "week") {
      const counts = new Map<string, number>(DAY_ORDER.map((d) => [d, 0]))

      for (const c of stageCases) {
        const hasRisk = (c.images || []).some((img) => img.ai_analysis_result?.ckdRisk === stageRiskValue)
        if (!hasRisk) continue
        const day = DAY_ORDER[new Date(c.study_date).getDay()]
        counts.set(day, (counts.get(day) || 0) + 1)
      }

      return DAY_ORDER.map((day) => ({ label: day, value: counts.get(day) || 0 }))
    }

    const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
    const weekCounts = [0, 0, 0, 0, 0]
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    const start = new Date(end)
    start.setDate(end.getDate() - 29)
    start.setHours(0, 0, 0, 0)

    for (const c of stageCases) {
      const hasRisk = (c.images || []).some((img) => img.ai_analysis_result?.ckdRisk === stageRiskValue)
      if (!hasRisk) continue

      const d = new Date(c.study_date)
      if (d < start || d > end) continue

      const dayMs = 24 * 60 * 60 * 1000
      const diffDays = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - start.getTime()) / dayMs)
      const weekIndex = Math.min(4, Math.floor(diffDays / 7))
      weekCounts[weekIndex] += 1
    }

    return weekLabels.map((label, idx) => ({ label, value: weekCounts[idx] }))
  }, [stageCases, stageRange, stageRiskValue])

  const stagePeak = useMemo(() => ckdStageSeries.reduce((max, item) => Math.max(max, item.value), 0), [ckdStageSeries])

  const dayMetrics = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)

    const todayCases = trendCases.filter((c) => {
      const d = new Date(c.study_date)
      return d >= todayStart
    })

    const yesterdayCases = trendCases.filter((c) => {
      const d = new Date(c.study_date)
      return d >= yesterdayStart && d < todayStart
    })

    const countCkdDetected = (cases: typeof trendCases) =>
      cases.filter((c) => (c.images || []).some((img) => img.ai_analysis_result?.ckdRisk === "HIGH")).length

    const countPending = (cases: typeof trendCases) =>
      cases.filter((c) => (c.images || []).some((img) => img.ai_analysis_status === "pending")).length

    return {
      today: {
        screenings: todayCases.length,
        ckdDetected: countCkdDetected(todayCases),
        pending: countPending(todayCases),
      },
      yesterday: {
        screenings: yesterdayCases.length,
        ckdDetected: countCkdDetected(yesterdayCases),
        pending: countPending(yesterdayCases),
      },
    }
  }, [trendCases])

  const buildTrend = (todayValue: number, yesterdayValue: number) => {
    const direction: "up" | "down" = todayValue >= yesterdayValue ? "up" : "down"
    const changePct =
      yesterdayValue === 0
        ? todayValue === 0
          ? 0
          : 100
        : (Math.abs(todayValue - yesterdayValue) / yesterdayValue) * 100

    return {
      trendType: direction,
      trendText: `${changePct.toFixed(1)}% ${direction === "up" ? "Up" : "down"} from yesterday`,
    }
  }

  const screeningsTrend = buildTrend(dayMetrics.today.screenings, dayMetrics.yesterday.screenings)
  const pendingTrend = buildTrend(dayMetrics.today.pending, dayMetrics.yesterday.pending)
  const ckdTrend = buildTrend(dayMetrics.today.ckdDetected, dayMetrics.yesterday.ckdDetected)

  const totalScreenings = dayMetrics.today.screenings || todayStats?.total || 0
  const ckdDetected = dayMetrics.today.ckdDetected || todayStats?.ckdDetected || 0
  const normalDetected = todayStats?.normal ?? 0
  const totalPatients = patientsData?.pagination?.total ?? 0
  const pendingToday = dayMetrics.today.pending

  const barMax = weeklyScreenings[0]?.max || 10

  return (
    <div className="min-h-full bg-white px-6 py-6">
      <div className="max-w-[1600px] mx-auto space-y-5">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard
            title="Total Patients (All time)"
            value={totalPatients.toLocaleString()}
            icon={<Users className="h-4 w-4" />}
            trend=""
            trendType="up"
            chips={[`${ckdDetected} CKD`, `${normalDetected} Normal`]}
          />
          <MetricCard
            title="Today's Screenings"
            value={totalScreenings.toLocaleString()}
            icon={<Search className="h-4 w-4" />}
            trend={screeningsTrend.trendText}
            trendType={screeningsTrend.trendType}
          />
          <MetricCard
            title="Follow-ups Pending"
            value={pendingToday.toLocaleString()}
            icon={<Clock3 className="h-4 w-4" />}
            trend={pendingTrend.trendText}
            trendType={pendingTrend.trendType}
          />
          <MetricCard
            title="CKD Detected Today"
            value={ckdDetected.toLocaleString()}
            icon={<AlertCircle className="h-4 w-4" />}
            trend={ckdTrend.trendText}
            trendType={ckdTrend.trendType}
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-[28px] border border-[#c9dcec] bg-[#E9F6FD] backdrop-blur-[4px] p-5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_24px_rgba(113,147,176,0.16)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#0f6ca2]">Screening Analytics</h2>
              <div className="w-[128px]">
                <Select value={screeningRange} onValueChange={(value) => setScreeningRange(value as "week" | "month")}>
                  <SelectTrigger className="h-7 rounded-full border-[#b9d4e7] bg-[#edf5fb] text-[#566e82] text-xs px-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <SelectValue placeholder="Select range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border-[#c4d8e8] bg-white text-[#4f6679]">
                    <SelectItem
                      value="week"
                      className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be] data-[state=checked]:bg-[#edf5fb] data-[state=checked]:text-[#2e84be]"
                    >
                      This week
                    </SelectItem>
                    <SelectItem
                      value="month"
                      className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be] data-[state=checked]:bg-[#edf5fb] data-[state=checked]:text-[#2e84be]"
                    >
                      This month
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyScreenings} margin={{ top: 12, right: 18, left: 20, bottom: 28 }}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#d7e5f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#707f8d", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: screeningRange === "week" ? "Day of Week" : "Week of Month",
                      position: "insideBottom",
                      offset: -8,
                      fill: "#7d8b97",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    tick={{ fill: "#707f8d", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, barMax]}
                    label={{ value: "Number of Screenings", angle: -90, position: "insideLeft", fill: "#7d8b97", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(47, 142, 196, 0.08)" }}
                    contentStyle={{
                      backgroundColor: "#f3f8fc",
                      border: "1px solid #c3d8ea",
                      borderRadius: "12px",
                    }}
                  />
                  <ReferenceLine y={0} stroke="#d2e2ef" />
                  <Bar dataKey="value" fill="#2f8ec4" radius={[8, 8, 8, 8]} barSize={46} background={{ fill: "#f1f1f1", radius: 8 }}>
                    <LabelList dataKey="value" content={<BarValueLabel />} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#c9dcec] bg-[#E9F6FD] backdrop-blur-[4px] p-5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_24px_rgba(113,147,176,0.16)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#0f6ca2]">CKD Distribution</h2>
              <div className="w-[128px]">
                <Select value={ckdRange} onValueChange={(value) => setCkdRange(value as "week" | "month")}>
                  <SelectTrigger className="h-7 rounded-full border-[#b9d4e7] bg-[#edf5fb] text-[#566e82] text-xs px-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <SelectValue placeholder="Select range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border-[#c4d8e8] bg-white text-[#4f6679]">
                    <SelectItem
                      value="week"
                      className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be] data-[state=checked]:bg-[#edf5fb] data-[state=checked]:text-[#2e84be]"
                    >
                      This week
                    </SelectItem>
                    <SelectItem
                      value="month"
                      className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be] data-[state=checked]:bg-[#edf5fb] data-[state=checked]:text-[#2e84be]"
                    >
                      This month
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-[360px]">
              {hasCkdData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ckdDistribution}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={95}
                      outerRadius={145}
                      paddingAngle={1}
                      cx="50%"
                      cy="50%"
                      startAngle={90}
                      endAngle={-270}
                      label={renderPieLabel}
                      labelLine={false}
                    >
                      {ckdDistribution.map((entry) => (
                        <Cell key={entry.label} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f3f8fc",
                        border: "1px solid #c3d8ea",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center px-6">
                  <div>
                    <p className="text-sm font-semibold text-[#56748a]">No CKD distribution data</p>
                    <p className="text-xs text-[#7f96a8] mt-1">No analyzed cases found for this selected range.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2 pt-2">
              {ckdDistribution.map((stage) => (
                <div key={stage.label} className="flex flex-col items-center gap-1">
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: stage.color }} />
                  <p className="text-[10px] text-[#566e82] text-center">{stage.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="rounded-[28px] border border-[#c9dcec] bg-[#E9F6FD] backdrop-blur-[4px] p-5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_24px_rgba(113,147,176,0.16)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#0f6ca2]">Gender Distribution</h2>
              <div className="w-[128px]">
                <Select value={genderRange} onValueChange={(value) => setGenderRange(value as "week" | "month")}>
                  <SelectTrigger className="h-7 rounded-full border-[#b9d4e7] bg-[#edf5fb] text-[#566e82] text-xs px-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <SelectValue placeholder="Select range" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border-[#c4d8e8] bg-white text-[#4f6679]">
                    <SelectItem value="week" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">This week</SelectItem>
                    <SelectItem value="month" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-4">
              <p className="text-2xl font-bold text-[#10689f]">{genderStats.total}</p>
              <p className="text-sm text-[#6c7278] mb-1">Patients</p>
            </div>

            <div className="flex items-center gap-10 mb-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#35b5d2]" />
                <p className="text-xs text-[#6c7278]">Female <span className="font-semibold">{genderStats.femalePct}%</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#2f8ec4]" />
                <p className="text-xs text-[#6c7278]">Male <span className="font-semibold">{genderStats.malePct}%</span></p>
              </div>
            </div>

            <div className="h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderStats.data}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="96%"
                    innerRadius={92}
                    outerRadius={130}
                    stroke="none"
                  >
                    {genderStats.data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Pie
                    data={genderStats.data}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="96%"
                    innerRadius={56}
                    outerRadius={92}
                    stroke="none"
                  >
                    {genderStats.data.map((entry) => (
                      <Cell key={`${entry.name}-inner`} fill={entry.color} opacity={0.82} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-x-0 bottom-4 text-center">
                <p className="text-base font-bold text-[#0a0f14]">{totalPatients.toLocaleString()} +</p>
                <p className="text-xs text-[#1e2831]">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 rounded-[28px] border border-[#c9dcec] bg-[#E9F6FD] backdrop-blur-[4px] p-5 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_24px_rgba(113,147,176,0.16)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#0f6ca2]">CKD Stage Analytics</h2>
              <div className="flex items-center gap-3">
                <div className="w-[128px]">
                  <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as "Critical" | "Moderate" | "Low")}>
                    <SelectTrigger className="h-7 rounded-full border-[#b9d4e7] bg-[#edf5fb] text-[#566e82] text-xs px-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#d55b4d]" />
                        <SelectValue placeholder="Severity" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-[#c4d8e8] bg-white text-[#4f6679]">
                      <SelectItem value="Critical" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">Critical</SelectItem>
                      <SelectItem value="Moderate" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">Moderate</SelectItem>
                      <SelectItem value="Low" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[128px]">
                  <Select value={stageRange} onValueChange={(value) => setStageRange(value as "week" | "month")}>
                    <SelectTrigger className="h-7 rounded-full border-[#b9d4e7] bg-[#edf5fb] text-[#566e82] text-xs px-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <SelectValue placeholder="Select range" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="border-[#c4d8e8] bg-white text-[#4f6679]">
                      <SelectItem value="week" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">This week</SelectItem>
                      <SelectItem value="month" className="text-xs text-[#4f6679] focus:bg-[#edf5fb] focus:text-[#2e84be]">This month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ckdStageSeries} margin={{ top: 10, right: 20, left: 20, bottom: 24 }}>
                  <defs>
                    <linearGradient id="stageFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d95f52" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#d95f52" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#d4e3ef" vertical={true} horizontal={true} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f7e8a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: stageRange === "week" ? "Day Of Week" : "Week Of Month", position: "insideBottom", offset: -8, fill: "#7d8b97", fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: "#6f7e8a", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    domain={[0, Math.max(5, stagePeak + 2)]}
                    label={{ value: "Number Of Patients", angle: -90, position: "insideLeft", fill: "#7d8b97", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #d9e6f1",
                      borderRadius: "10px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#d95f52"
                    strokeWidth={3}
                    fill="url(#stageFill)"
                    dot={{ r: 5, strokeWidth: 3, fill: "#d95f52", stroke: "#ffffff" }}
                    activeDot={{ r: 7, strokeWidth: 4, fill: "#d95f52", stroke: "#ffffff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
