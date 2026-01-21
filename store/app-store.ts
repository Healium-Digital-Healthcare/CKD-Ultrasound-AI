import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { patientsApi } from "./services/patients"
import { casesApi } from "./services/cases"
import { organizationApi } from "./services/organization"
import { notificationsApi } from "./services/notifications"

export const store = configureStore({
  reducer: {
    [patientsApi.reducerPath]: patientsApi.reducer,
    [casesApi.reducerPath]: casesApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(patientsApi.middleware, casesApi.middleware , organizationApi.middleware, notificationsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
