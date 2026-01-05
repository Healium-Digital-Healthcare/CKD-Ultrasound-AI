import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { patientsApi } from "./services/patients"
import { casesApi } from "./services/cases"
import { organizationApi } from "./services/organization"

export const store = configureStore({
  reducer: {
    [patientsApi.reducerPath]: patientsApi.reducer,
    [casesApi.reducerPath]: casesApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(patientsApi.middleware, casesApi.middleware , organizationApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
