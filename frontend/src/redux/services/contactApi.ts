import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAPI } from "../../utils/configs";

interface ContactRequestInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
interface ContactRequestResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/` }),
  endpoints: (builder) => ({
    submitContact: builder.mutation<ContactRequestResponse, ContactRequestInput>({
      query: (body) => ({
        url: "contact/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitContactMutation } = contactApi;
