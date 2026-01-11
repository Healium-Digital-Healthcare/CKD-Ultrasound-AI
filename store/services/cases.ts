import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CaseListResponse, CaseStats, ImageAnalysis, Measurement, type Case, type CreateCaseType } from "@/types/case"
import { QueryRequest } from "@/types/query";

export const casesApi = createApi({
  reducerPath: "casesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Case", "ImageAnalysis"],
  endpoints: (builder) => ({
    getCases: builder.query<CaseListResponse, QueryRequest>({
      query: ({params}) => ({
        url: "/cases",
        method: "GET",
        params: params
      }),
      providesTags: ["Case"],
    }),
    getCase: builder.query<Case, string>({
      query: (case_number) => `/cases/${case_number}`,
      providesTags: ["Case"],
    }),
    createCase: builder.mutation<Case, CreateCaseType>({
      query: (caseData) => ({
        url: "/cases",
        method: "POST",
        body: caseData,
      }),
      invalidatesTags: ["Case"],
    }),
    updateCase: builder.mutation<Case, { id: string; data: Partial<Case> }>({
      query: ({ id, data }) => ({
        url: `/cases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Case", id }],
    }),
    deleteCase: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Case"],
    }),
    predictCase: builder.mutation<{ success: boolean; aiAnalysis: any; case: any }, FormData>({
      query: (formData) => ({
        url: "/predict",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, formData) => {
        const caseId = formData.get("caseId") as string
        return [{ type: "Case", id: caseId }, "Case"]
      },
    }),
    getImageAnalysis: builder.query<ImageAnalysis, string>({
      query: (analyisiId) => ({
        url: `/image-analysis/${analyisiId}/analysis`,
        method: "GET",
      }),
      providesTags: ['ImageAnalysis']
    }),
    triggerReanalysis: builder.mutation<void, string>({
      query: (imageId) => ({
        url: `/image-analysis/${imageId}/reanalyze`,
        method: "POST",
      }),
      invalidatesTags: (result, error, imageId) => [{ type: "ImageAnalysis", id: imageId }],
    }),
    deleteImage: builder.mutation<void, string>({
      query: (imageId) => ({
        url: `/image-analysis/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, imageId) => [{ type: "ImageAnalysis", id: imageId }, "Case"],
    }),
    addImagesToCase: builder.mutation<void, { caseId: string; images: { image_path: string; case_id: string }[] }>({
      query: ({ caseId, images }) => ({
        url: `/cases/${caseId}/images`,
        method: "POST",
        body: { images },
      }),
      invalidatesTags: (result, error, { caseId }) => [{ type: "Case", id: caseId }],
    }),
    runAnalysis: builder.mutation<void, string>({
      query: (case_id) => ({
        url: `/image-analysis/analysis/${case_id}`,
        method: "POST",
      }),
      invalidatesTags: ['Case']
    }),
    getCaseImages: builder.query<ImageAnalysis[], string>({
      query: (case_id) => `/image-analysis/analysis/${case_id}`,
    }),
    updateImageAnalysis: builder.mutation<ImageAnalysis, { imageId: string; ai_analysis_result: any }>({
      query: ({ imageId, ai_analysis_result }) => ({
        url: `/image-analysis/${imageId}`,
        method: "PUT",
        body: { ai_analysis_result },
      }),
      invalidatesTags: ['ImageAnalysis']
    }),
    getCaseByCaseId: builder.query<Case, string>({
      query: (id) => ({
        url: `/cases/case/${id}`,
        method: 'GET'
      }),
      providesTags: ['Case']
    }),
    saveMeasurements: builder.mutation<ImageAnalysis, { imageId: string; measurements: Measurement[] }>({
      query: ({ imageId, measurements }) => ({
        url: `/image-analysis/${imageId}/measurements`,
        method: "PUT",
        body: { measurements },
      }),
      invalidatesTags: (_result, _error, { imageId }) => [
        { type: "ImageAnalysis", id: imageId },
        { type: "ImageAnalysis" },
      ],
    }),
    getCaseStats: builder.query<CaseStats, void>({
      query: () => "/cases/stats",
      providesTags: ["Case"],
    }),
    getSignedUrl: builder.query<{ signedUrl: string }, string>({
      query: (path) => ({
        url: "/images/get-signed-url",
        method: "POST",
        body: { path },
      }),
    }),
    getUploadUrl: builder.mutation<
      { files: Array<{ name: string; path: string; signedUrl: string; token: string }> },
      { files: Array<{ name: string }> }
    >({
      query: (body) => ({
        url: "/images/upload-url",
        method: "POST",
        body,
      }),
    }),
    getCaseFileSize: builder.query<{ formattedSize: string; bytes: number }, string>({
      query: (caseId) => ({
        url: "/cases/file-size",
        method: "POST",
        body: { caseId },
      }),
    }),
  }),
})

export const {
  useGetCasesQuery,
  useGetCaseQuery,
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  usePredictCaseMutation,
  useLazyGetImageAnalysisQuery,
  useTriggerReanalysisMutation,
  useDeleteImageMutation,
  useAddImagesToCaseMutation,
  useGetImageAnalysisQuery,
  useRunAnalysisMutation,
  useLazyGetCaseImagesQuery,
  useUpdateImageAnalysisMutation,
  useGetCaseByCaseIdQuery,
  useSaveMeasurementsMutation,
  useGetCaseStatsQuery,
  useGetSignedUrlQuery,
  useGetUploadUrlMutation,
  useLazyGetSignedUrlQuery,
  useGetCaseFileSizeQuery
} = casesApi
