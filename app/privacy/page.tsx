import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Lock, FileCheck, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy & Security",
  description: "HIPAA compliance and security practices",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-6 -ml-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-7 w-7 text-emerald-600" />
            <h1 className="text-3xl font-semibold text-gray-900">Privacy & Security</h1>
          </div>
          <p className="text-gray-600 mt-2">HIPAA-compliant platform with enterprise-grade security</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Security</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 border rounded-lg">
              <Lock className="h-5 w-5 text-gray-700 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Encryption</h3>
              <p className="text-sm text-gray-600">AES-256 encryption at rest, TLS 1.3 in transit</p>
            </div>

            <div className="p-6 border rounded-lg">
              <Shield className="h-5 w-5 text-gray-700 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Access Control</h3>
              <p className="text-sm text-gray-600">Role-based permissions and multi-factor authentication</p>
            </div>

            <div className="p-6 border rounded-lg">
              <FileCheck className="h-5 w-5 text-gray-700 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Audit Logs</h3>
              <p className="text-sm text-gray-600">Complete activity tracking for compliance</p>
            </div>

            <div className="p-6 border rounded-lg">
              <Database className="h-5 w-5 text-gray-700 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">Backups</h3>
              <p className="text-sm text-gray-600">Automated daily backups with point-in-time recovery</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">HIPAA Compliance</h2>
          <div className="space-y-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Protected Health Information</h3>
              <p>
                All patient data is handled according to HIPAA Privacy Rule requirements. PHI is only accessed by
                authorized personnel and never shared without consent.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Business Associate Agreements</h3>
              <p>
                We execute BAAs with all covered entities and maintain appropriate safeguards as required by HIPAA
                Security Rule.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Patient Rights</h3>
              <ul className="space-y-1 mt-2">
                <li>• Access to medical records</li>
                <li>• Request corrections to health information</li>
                <li>• Receive notice of privacy practices</li>
                <li>• Request restrictions on data use</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Collection & Use</h2>
          <div className="space-y-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What We Collect</h3>
              <ul className="space-y-1">
                <li>• Patient demographics and medical record numbers</li>
                <li>• Ultrasound images and DICOM files</li>
                <li>• Clinical data including diagnoses and eGFR values</li>
                <li>• User account and system usage information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">How We Use Data</h3>
              <ul className="space-y-1">
                <li>• Provide AI-powered ultrasound analysis</li>
                <li>• Generate medical reports</li>
                <li>• Improve AI accuracy with de-identified data</li>
                <li>• System maintenance and security monitoring</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Data Retention</h3>
              <p>
                Records are retained for 7 years per healthcare regulations. Data deletion requests are honored after
                the retention period.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Privacy Questions?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Contact our Privacy Officer for questions about data practices or to exercise your HIPAA rights.
            </p>
            <p className="text-sm text-gray-900">
              <a href="mailto:privacy@ckdultrasound.ai" className="text-primary hover:underline">
                privacy@ckdultrasound.ai
              </a>
              {" • "}
              <a href="tel:+18005551234" className="text-primary hover:underline">
                +1 (800) 555-1234
              </a>
            </p>
          </div>
        </section>

        <div className="mt-12 pt-6 border-t">
          <p className="text-xs text-gray-500">Last updated: December 22, 2024</p>
        </div>
      </div>
    </div>
  )
}