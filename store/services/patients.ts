import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { EgfrTimelinePoint, FetchPatientByPatienIdResponse, Patient, PatientListResponse, PatientStats } from "@/types/patient"
import { QueryRequest } from "@/types/query";

export const patientsApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    getPatients: builder.query<PatientListResponse, QueryRequest>({
      query: ({params}) => ({
        url: "/patients",
        method: "GET",
        params
      }),
      providesTags: ["Patient"],
    }),
    getPatient: builder.query<Patient, string>({
      query: (id) => `/patients/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Patient", id }],
    }),
    createPatient: builder.mutation<Patient, Partial<Patient>>({
      query: (patient) => ({
        url: "/patients",
        method: "POST",
        body: patient,
      }),
      invalidatesTags: ["Patient"],
    }),
    updatePatient: builder.mutation<Patient, { id: string; data: Partial<Patient> }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Patient'],
    }),
    deletePatient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
    getPatientByPatientId: builder.query<FetchPatientByPatienIdResponse, string>({
      query: (patientId) => ({
        url: '/patients/findByPatientId',
        method: 'GET',
        params: { patientId }
      })
    }),
    getPatientStats: builder.query<PatientStats, void>({
      query: () => "/patients/stats",
      providesTags: ["Patient"],
    }),
    getPatientTimeLine: builder.query<EgfrTimelinePoint[],string>({
      query: (id) => ({
        url: `/patients/${id}/timeline`,
        method: 'GET'
      })
    })
  }),
})

export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useLazyGetPatientByPatientIdQuery,
  useGetPatientStatsQuery,
  useGetPatientTimeLineQuery
} = patientsApi
