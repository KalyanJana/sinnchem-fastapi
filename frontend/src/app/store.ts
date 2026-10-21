import { configureStore } from "@reduxjs/toolkit";
import { sinnchemApi } from "../services/sinnchemApi";

export const store = configureStore({
  reducer: {
    [sinnchemApi.reducerPath]: sinnchemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sinnchemApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
