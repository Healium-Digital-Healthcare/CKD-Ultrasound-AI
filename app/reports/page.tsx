import { FileBarChart, Clock, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full p-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <FileBarChart className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Advanced Reports Coming Soon</h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We&apos;re working on powerful reporting features including custom report builders, scheduled exports, and advanced
          data analytics to help you make better decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Custom Reports</h3>
            <p className="text-xs text-gray-600">Build tailored reports for your needs</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Analytics</h3>
            <p className="text-xs text-gray-600">Deep insights into patient data</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <FileBarChart className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Export Options</h3>
            <p className="text-xs text-gray-600">PDF, Excel, and CSV exports</p>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          For now, check out the analytics on the{" "}
          <a href="/dashboard" className="text-primary hover:underline font-medium">
            Dashboard
          </a>
        </p>
      </Card>
    </div>
  )
}
