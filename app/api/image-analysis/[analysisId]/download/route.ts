import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import puppeteer from "puppeteer"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const supabase = await createClient()
    const { analysisId } = await params

    const { data: imageAnalysis, error } = await supabase
      .from("image_analysis")
      .select("report_html, case_id")
      .eq("id", analysisId)
      .single()

    if (error || !imageAnalysis) {
      return NextResponse.json({ error: "Image analysis not found" }, { status: 404 })
    }

    if (!imageAnalysis.report_html) {
      return NextResponse.json({ error: "No report available" }, { status: 404 })
    }

    const logoPath = path.join(process.cwd(), "public", "logo", "logo.svg")
    const logoSvg = fs.readFileSync(logoPath, "utf-8")
    const logoBase64 = Buffer.from(logoSvg).toString("base64")
    const logoDataUri = `data:image/svg+xml;base64,${logoBase64}`

    // Replace inline SVG with img tag using data URI
    const htmlWithLogo = imageAnalysis.report_html.replace(/src="\/logo\/logo\.svg"/g, `src="${logoDataUri}"`)

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()

    await page.setContent(htmlWithLogo, {
      waitUntil: "networkidle0",
    })

    // await page.setContent(imageAnalysis.report_html, {
    //   waitUntil: "networkidle0",
    // })

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    })

    await browser.close()

    // Convert Uint8Array to Buffer
    const pdfBuffer = Buffer.from(pdfUint8)

    const fileName = `kidney-report-${imageAnalysis.case_id}-${analysisId}.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
