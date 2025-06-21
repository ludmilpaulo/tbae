import { Province, Town, Venue } from '@/types/venue';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseAPI } from '../../utils/configs';

export const venuesApi = createApi({
  reducerPath: 'venuesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/venues` }),
  endpoints: (builder) => ({
    getProvinces: builder.query<Province[], void>({
      query: () => `provinces/`,
    }),
    getTowns: builder.query<Town[], number | undefined>({
      query: (provinceId: number | undefined) => provinceId ? `towns/?province=${provinceId}` : `towns/`,
    }),
    getVenues: builder.query<Venue[], { provinceId?: number; townId?: number }>({
      query: ({ provinceId, townId }: { provinceId?: number; townId?: number }) => {
        let url = 'venues/?';
        if (provinceId) url += `province=${provinceId}`;
        if (townId) url += `&town=${townId}`;
        return url;
      },
    }),
    // ------ ADD THIS ------
    getVenueById: builder.query<Venue, number>({
      query: (id: number) => `venues/${id}/`,
    }),
  }),
});

export const {
  useGetProvincesQuery,
  useGetTownsQuery,
  useGetVenuesQuery,
  useGetVenueByIdQuery,   // <-- Add this!
} = venuesApi;
