import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiMessage, BusinessEnquiry } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "/api";

export const sinnchemApi = createApi({
  reducerPath: "sinnchemApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    sendBusinessEnquiry: builder.mutation<ApiMessage, BusinessEnquiry>({
      query: (body) => ({ url: "/contact", method: "POST", body }),
    }),
    submitCareerApplication: builder.mutation<ApiMessage, FormData>({
      query: (body) => ({ url: "/careers", method: "POST", body }),
    }),
  }),
});

export const {
  useSendBusinessEnquiryMutation,
  useSubmitCareerApplicationMutation,
} = sinnchemApi;
