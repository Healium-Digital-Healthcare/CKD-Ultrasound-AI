import { supabase } from "@/lib/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { caseId } = await req.json()

    if (!caseId) {
      return NextResponse.json({ error: "caseId is required" }, { status: 400 })
    }

    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .select("images:image_analysis(id, image_path)")
      .eq("id", caseId)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    let totalSize = 0

    for (const image of caseData.images ?? []) {
      if (!image.image_path) continue

      const pathParts = image.image_path.split("/")
      const fileName = pathParts.pop()!
      const folderPath = pathParts.join("/")

      const { data: files, error } = await supabase.storage
        .from("medical-images")
        .list(folderPath, { search: fileName })

      if (error || !files?.length) continue

      const file = files.find(f => f.name === fileName)
      if (file?.metadata?.size) {
        totalSize += file.metadata.size
      }
    }

    return NextResponse.json({
      totalSize,
      formattedSize: formatFileSize(totalSize),
    })
  } catch (error) {
    console.error("Error calculating file size:", error)
    return NextResponse.json({ error: "Failed to calculate file size" }, { status: 500 })
  }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}
