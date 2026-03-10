import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import puppeteer, { type Browser } from "puppeteer"
import chromium from "@sparticuz/chromium"

const isProduction = process.env.NODE_ENV === "production"

async function getBrowser(): Promise<Browser> {
  if (isProduction) {
    // Use @sparticuz/chromium for Vercel serverless
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  } else {
    // Use local Chrome for development
    // Common Chrome paths for different OS
    const possiblePaths = [
      // Windows
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
      // macOS
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      // Linux
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
    ]
    
    let executablePath = ""
    for (const p of possiblePaths) {
      if (p && fs.existsSync(p)) {
        executablePath = p
        break
      }
    }
    
    if (!executablePath) {
      throw new Error("Chrome not found. Please install Chrome or set CHROME_PATH environment variable.")
    }
    
    return puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { analysisId } = await params

    const { data: imageAnalysis, error } = await supabase
      .from("image_analysis")
      .select(`
        report_html, 
        case_id,
        case:cases(case_number, patient_id, patient:patients(name))
      `)
      .eq("id", analysisId)
      .single()

    if (error || !imageAnalysis) {
      return NextResponse.json({ error: "Image analysis not found" }, { status: 404 })
    }

    if (!imageAnalysis.report_html) {
      return NextResponse.json({ error: "No report available" }, { status: 404 })
    }

    // Read and embed logo as base64
    const logoPath = path.join(process.cwd(), "public", "logo", "logo.svg")
    const logoSvg = fs.readFileSync(logoPath, "utf-8")
    const logoBase64 = Buffer.from(logoSvg).toString("base64")
    const logoDataUri = `data:image/svg+xml;base64,${logoBase64}`

    // Replace inline SVG with img tag using data URI
    const htmlWithLogo = imageAnalysis.report_html.replace(/src="\/logo\/logo\.svg"/g, `src="${logoDataUri}"`)

    // Get browser based on environment
    const browser = await getBrowser()

    const page = await browser.newPage()

    await page.setContent(htmlWithLogo, {
      waitUntil: "networkidle0",
    })

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

    // Create report_generated notification
    const caseData = imageAnalysis.case as any
    if (caseData) {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "report_generated",
        title: "Report Generated",
        message: `Report for case ${caseData.case_number} has been generated and downloaded. Patient: ${caseData.patient?.name || "Unknown"}`,
        case_id: imageAnalysis.case_id,
        patient_id: caseData.patient_id,
      })
    }

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
