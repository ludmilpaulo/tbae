// src/redux/services/clientApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Client } from "@/types/client";
import { baseAPI } from "../../utils/configs"; // your API base, e.g., 'http://127.0.0.1:8000'

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/` }),
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => "clients/",
    }),
  }),
});

export const { useGetClientsQuery } = clientApi;
