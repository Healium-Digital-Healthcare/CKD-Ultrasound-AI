import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { files, folderName } = body

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: 'Files array is required' },
        { status: 400 }
      )
    }

    const bucket = 'medical-images'

    // Generate signed URLs for each file
    const signedFiles = await Promise.all(
      files.map(async (file: { name: string }) => {
        // Sanitize filename and add timestamp
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_')
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(7)
        const fileName = `${timestamp}-${randomId}-${sanitizedName}`
        const filePath = folderName ? `${folderName}/${fileName}` : fileName

        // Generate signed upload URL
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUploadUrl(filePath)

        if (error) {
          throw new Error(`Failed to create signed URL: ${error.message}`)
        }

        return {
          name: file.name,
          path: data.path,
          signedUrl: data.signedUrl,
          token: data.token,
        }
      })
    )

    return NextResponse.json({ files: signedFiles })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate upload URLs' },
      { status: 500 }
    )
  }
}
