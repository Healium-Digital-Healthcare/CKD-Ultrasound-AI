import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Notification {
  id: string
  user_id: string
  type: "scan_complete" | "ckd_detected" | "report_generated"
  title: string
  message: string
  case_id: string | null
  patient_id: string | null
  is_read: boolean
  created_at: string
}

interface NotificationsResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Notifications", "NotificationCount"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 }) => ({
        url: "/notifications",
        method: "GET",
        params: { limit, offset },
      }),
      providesTags: ["Notifications"],
    }),
    markAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "NotificationCount"],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications", "NotificationCount"],
    }),
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications", "NotificationCount"],
    }),
    getNotificationCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/count",
      providesTags: ["NotificationCount"],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetNotificationCountQuery,
} = notificationsApi
