import { Province, Town, Venue } from '@/types/venue';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseAPI } from '../../utils/configs';

export const venuesApi = createApi({
  reducerPath: 'venuesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/venues/` }),
  endpoints: (builder) => ({
    getProvinces: builder.query<Province[], void>({
      query: () => `provinces/`,
    }),
    getTowns: builder.query<Town[], number | undefined>({
      query: (provinceId: number | undefined) => provinceId ? `towns/?province=${provinceId}` : `towns/`,
    }),
    getVenues: builder.query<Venue[], { provinceId?: number; townId?: number }>({
      query: ({ provinceId, townId }: { provinceId?: number; townId?: number }) => {
        const params: string[] = [];
        if (provinceId) params.push(`province=${provinceId}`);
        if (townId) params.push(`town=${townId}`);
        const qs = params.length ? `?${params.join('&')}` : '';
        return `venues/${qs}`; // DRF viewset path: /venues/venues/
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
