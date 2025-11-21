"use client"

import { UserPlus, Activity, Users, Heart } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      name: "Total no. of Normal Patients",
      value: 156,
      icon: UserPlus,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      name: "Total no. of Ultrasound",
      value: 342,
      icon: Activity,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      name: "Total no. of CKD Patients",
      value: 89,
      icon: Users,
      iconColor: "text-teal-500",
      bgColor: "bg-teal-50",
    },
    {
      name: "Implant Kidney",
      value: 23,
      icon: Heart,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard Overview</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} rounded-full p-3 flex-shrink-0`}>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}