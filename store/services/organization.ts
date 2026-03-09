import { DashboardApiResponse, DashboardStats } from "@/types/organization"
import { QueryRequest } from "@/types/query"
import { Organization } from "@/types/user"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const organizationApi = createApi({
  reducerPath: "organizationApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    updateOrganization: builder.mutation<{ success: boolean }, QueryRequest>({
      query: ({ body }) => ({
        url: "/organization",
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Organization"],
    }),
    getOrganization: builder.query<Organization,void>({
      query: () => ({
        url: "/organization",
        method: "GET",
      }),
      providesTags: ["Organization"],
    }),
    getDashboardStats: builder.query<DashboardApiResponse, QueryRequest>({
      query: ({params}) => ({
        url: '/organization/dashboard',
        method: 'GET',
        params
      })
    }),
    getTodayStats: builder.query<{
      total: number
      ckdDetected: number
      normal: number
      newPatients: number
      range: string
    }, void>({
      query: () => ({
        url: '/organization/dashboard/stats', // your API route
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useUpdateOrganizationMutation,
  useGetOrganizationQuery,
  useGetDashboardStatsQuery,
  useGetTodayStatsQuery
} = organizationApi
