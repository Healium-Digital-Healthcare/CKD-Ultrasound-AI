import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/types/organization";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const date_range = searchParams.get("date_range") || "last_30_days";

    // Calculate start date
    const now = new Date();
    let startDate: Date;
    if (date_range === "last_7_days") startDate = new Date(now.getTime() - 7*24*60*60*1000);
    else if (date_range === "last_30_days") startDate = new Date(now.getTime() - 30*24*60*60*1000);
    else if (date_range === "last_90_days") startDate = new Date(now.getTime() - 90*24*60*60*1000);
    else if (date_range === "last_year") startDate = new Date(now.getTime() - 365*24*60*60*1000);
    else startDate = new Date(now.getTime() - 30*24*60*60*1000);

    // Call RPC
    const { data, error } = await supabase
      .rpc("get_user_dashboard_stats", {
        uid: user.id,
        start_date: startDate.toISOString(),
      }).single();

    if (error) throw error;

    const stats = data as DashboardStats;
    console.log('datta', stats)

    // Build API response
    return NextResponse.json({
      stats: {
        totalCases: stats.total_cases || 0,
        totalPatients: stats.total_patients || 0,
        totalAnalyses: stats.total_analyses || 0,
        avgEgfr: stats.avg_egfr ? parseFloat(stats.avg_egfr.toFixed(1)) : 0,
      },
      severityData: [
        { name: "Stable", value: stats.stable || 0, color: "#22c55e" },
        { name: "Recovering", value: stats.recovering || 0, color: "#eab308" },
        { name: "Critical", value: stats.critical || 0, color: "#ef4444" },
      ],
      ckdDistribution: stats.ckd_distribution || [],
      comparisonData: [
        { name: "Total Cases", count: stats.total_cases || 0, fill: "#3b82f6" },
        { name: "Total Patients", count: stats.total_patients || 0, fill: "#10b981" },
      ],
    });

  } catch (error) {
    console.error('errror',error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
