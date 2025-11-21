import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CaseListResponse, ImageAIAnalysis, type Case, type CreateCaseType } from "@/types/case"
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
      query: (id) => `/cases/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Case", id }],
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
    getImageAnalysis: builder.query<ImageAIAnalysis, string>({
      query: (analyisiId) => ({
        url: `/image-analysis/${analyisiId}/analysis`,
        method: "GET",
      }),
    }),
    triggerReanalysis: builder.mutation<void, string>({
      query: (imageId) => ({
        url: `/image-analysis/${imageId}/reanalyze`,
        method: "POST",
      }),
      invalidatesTags: (result, error, imageId) => [{ type: "ImageAnalysis", id: imageId }],
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
} = casesApi
