import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help with CKD Ultrasound AI",
}

export default function HelpPage() {
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
          <h1 className="text-3xl font-semibold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-2">Get help with creating studies, running analysis, and generating reports</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Support</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg">
              <Mail className="h-5 w-5 text-gray-700 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Email</p>
              <a href="mailto:support@ckdultrasound.ai" className="text-sm text-gray-600 hover:text-gray-900">
                support@ckdultrasound.ai
              </a>
            </div>

            <div className="p-6 border rounded-lg">
              <Phone className="h-5 w-5 text-gray-700 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Phone</p>
              <a href="tel:+18005551234" className="text-sm text-gray-600 hover:text-gray-900">
                +1 (800) 555-1234
              </a>
            </div>

            <div className="p-6 border rounded-lg">
              <MessageSquare className="h-5 w-5 text-gray-700 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Live Chat</p>
              <p className="text-sm text-gray-600">Mon-Fri, 8AM-6PM EST</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How do I create a new study?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4">
                Click "Create Study" from the Cases page. Select a patient, upload kidney images, run AI analysis, and
                generate the report.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                What file formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4">
                DICOM (.dcm), PNG, JPEG, and TIFF formats are supported. DICOM files provide the best quality for
                analysis.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How accurate is the AI analysis?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4">
                The AI achieves 98.5% accuracy based on clinical validation. All results should be reviewed by a
                qualified healthcare professional.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Can I edit AI results?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4">
                Yes. Click "Edit" in the analysis panel to modify CKD risk, eGFR values, findings, and add clinical
                notes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Is the platform HIPAA compliant?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4">
                Yes. All data is encrypted, access is controlled, and we maintain comprehensive audit logs. See our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy & Security
                </Link>{" "}
                page for details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How do I export reports?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 pb-4">
                From the Reports page, select a study and use the Download PDF, Send to EMR, or Print buttons.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  )
}
