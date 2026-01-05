export type DashboardStats = {
  total_cases: number;
  total_patients: number;
  total_analyses: number;
  avg_egfr: number | null;
  stable: number;
  recovering: number;
  critical: number;
  ckd_distribution: { ckdRisk: string; count: number }[] | null;
};

export type DashboardApiResponse = {
  stats: {
    totalCases: number
    totalPatients: number
    totalAnalyses: number
    avgEgfr: number
  }
  severityData: {
    name: string
    value: number
    color: string
  }[]
  ckdDistribution: {
    ckdStage: string
    count: number
  }[]
  comparisonData: {
    name: string
    count: number
    fill: string
  }[]
}
