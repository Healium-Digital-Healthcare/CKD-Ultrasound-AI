
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

type AnalyzeResponse = { job_id: string; success: boolean; mess: string }
type KidneyDetectionResponse = { job_id: string; file_path?: string }

export const AIApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1` }),
  tagTypes: ["AI"],
  endpoints: (builder) => ({
    analyze: builder.mutation<AnalyzeResponse, string>({
      query: (caseId) => ({
        url: "/analyze",
        method: "POST",
        body: { case_id: caseId }
      }),
      invalidatesTags: ["AI"],
    }),
    submitKidneyDetection: builder.mutation<KidneyDetectionResponse, FormData>({
      query: (formData) => ({
        url: "/kidney-detection/jobs",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AI"],
    }),
  }),
})

export const {
    useAnalyzeMutation,
    useSubmitKidneyDetectionMutation,
} = AIApi