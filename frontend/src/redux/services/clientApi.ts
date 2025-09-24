// src/redux/services/clientApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Client } from "@/types/client";
import { baseAPI } from "../../utils/configs";

type RawClient = {
  id: number | string;
  name: string;
  logo: string;
  website?: string | null;
  order?: number | null;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isRawClient = (v: unknown): v is RawClient => {
  if (!isObject(v)) return false;
  const o = v as Record<string, unknown>;
  const idOk = typeof o.id === "number" || typeof o.id === "string";
  return idOk && typeof o.name === "string" && typeof o.logo === "string";
};

const toClient = (rc: RawClient, idx: number): Client => ({
  id: typeof rc.id === "string" ? Number.isNaN(Number(rc.id)) ? rc.id as unknown as number : Number(rc.id) : rc.id,
  name: rc.name,
  logo: rc.logo,
  website: rc.website ?? undefined,
  // ensure required field exists
  order: typeof rc.order === "number" ? rc.order : idx,
});

const toClientArray = (payload: unknown): Client[] => {
  // Array case
  if (Array.isArray(payload)) {
    return payload.filter(isRawClient).map(toClientWithIndex);
  }
  // Paginated case
  if (isObject(payload) && Array.isArray((payload as Paginated<RawClient>).results)) {
    return (payload as Paginated<RawClient>).results
      .filter(isRawClient)
      .map(toClientWithIndex);
  }
  return [];
};

function toClientWithIndex(rc: RawClient, idx: number): Client {
  return toClient(rc, idx);
}

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/` }),
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => "clients/",
      transformResponse: (resp: unknown): Client[] => toClientArray(resp),
    }),
  }),
});

export const { useGetClientsQuery } = clientApi;
