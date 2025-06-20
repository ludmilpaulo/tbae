import { Province, Town, Venue } from '@/types/venue';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseAPI } from '../../utils/configs';

// --- Types for clarity (can be imported from your types/venue file) ---
// export interface Province { id: number; name: string }
// export interface Town { id: number; name: string; province: Province }
// export interface VenueImage { id: number; image: string; caption?: string }
// export interface Venue { id: number; name: string; province: Province; town: Town; description: string; details?: string; latitude?: number; longitude?: number; images: VenueImage[] }

export const venuesApi = createApi({
  reducerPath: 'venuesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/venues` }),
  endpoints: (builder) => ({
    getProvinces: builder.query<Province[], void>({
      query: () => `provinces/`,
    }),
    getTowns: builder.query<Town[], number | undefined>({
      // provinceId: number | undefined
      query: (provinceId: number | undefined) => provinceId ? `towns/?province=${provinceId}` : `towns/`,
      // Don't use skip in RTK Query builder (skip is a hook option, not builder param)
    }),
    getVenues: builder.query<Venue[], { provinceId?: number; townId?: number }>({
      query: ({ provinceId, townId }: { provinceId?: number; townId?: number }) => {
        let url = 'venues/?';
        if (provinceId) url += `province=${provinceId}`;
        if (townId) url += `&town=${townId}`;
        return url;
      },
    }),
  }),
});

export const {
  useGetProvincesQuery,
  useGetTownsQuery,
  useGetVenuesQuery,
} = venuesApi;
