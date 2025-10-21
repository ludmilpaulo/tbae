import { Province, Town, Venue } from '@/types/venue';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseAPI } from '../../utils/configs';

// Helper types to safely unwrap DRF pagination
type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

type ProvinceResponse = Paginated<Province> | Province[];
type TownResponse = Paginated<Town> | Town[];
type VenueResponse = Paginated<Venue> | Venue[];

export const venuesApi = createApi({
  reducerPath: 'venuesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${baseAPI}/venues/`,
    // Add debugging
    prepareHeaders: (headers) => {
      console.log('API Request to:', `${baseAPI}/venues/`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getProvinces: builder.query<Province[], void>({
      query: () => `provinces/`,
      transformResponse: (resp: ProvinceResponse): Province[] =>
        Array.isArray(resp) ? resp : resp.results,
    }),
    getTowns: builder.query<Town[], number | undefined>({
      query: (provinceId: number | undefined) => (provinceId ? `towns/?province=${provinceId}` : `towns/`),
      transformResponse: (resp: TownResponse): Town[] =>
        Array.isArray(resp) ? resp : resp.results,
    }),
    getVenues: builder.query<Venue[], { provinceId?: number; townId?: number }>({
      query: ({ provinceId, townId }: { provinceId?: number; townId?: number }) => {
        const params: string[] = [];
        if (provinceId) params.push(`province=${provinceId}`);
        if (townId) params.push(`town=${townId}`);
        const qs = params.length ? `?${params.join('&')}` : '';
        return `venues/${qs}`; // DRF viewset path: /venues/venues/
      },
      transformResponse: (resp: VenueResponse): Venue[] =>
        Array.isArray(resp) ? resp : resp.results,
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
  useGetVenueByIdQuery, // <-- Add this!
} = venuesApi;
