"use client"

import { UserPlus, UserCheck, User } from "lucide-react"

export default function DashboardPage() {
  const patientsCount = [
    {
      name: "Total no. of Normal Patients",
      value: 156,
      icon: UserPlus,
      class: "text-sky-400",
    },
    {
      name: "Total no. of Ultrasound",
      value: 342,
      icon: UserCheck,
      class: "text-purple-400",
    },
    {
      name: "Total no. of CKD Patients",
      value: 89,
      icon: User,
      class: "text-teal-400",
    },
    {
      name: "Implant kidney",
      value: 23,
      icon: UserPlus,
      class: "text-green-500",
    },
  ]

  return (
    <div className="content">
      <div className="py-6 mt-20">
        <div className="flex items-center">
          <div className="container max-w-6xl px-5 mx-auto">
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-2">
              {patientsCount.map((item) => (
                <div className="p-5 bg-white rounded shadow-sm" key={item.name}>
                  <div className="flex items-center space-x-4">
                    <item.icon
                      className={`m-4 rounded-full p-2 flex-shrink-0 h-12 w-12 ${item.class}`}
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-2xl text-gray-800">{item.name}</div>
                      <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
