
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const AIApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1" }),
  // baseQuery: fetchBaseQuery({ baseUrl: "https://ckd-ai.duckdns.org/api/v1" }),
  tagTypes: ["AI"],
  endpoints: (builder) => ({
    analyze: builder.mutation<{ job_id: string, success: boolean, mess: string }, string>({
      query: (caseId) => ({
        url: "/analyze",
        method: "POST",
        body: { case_id: caseId }
      }),
      invalidatesTags: ["AI"],
    }),
  }),
})

export const {
    useAnalyzeMutation
} = AIApi