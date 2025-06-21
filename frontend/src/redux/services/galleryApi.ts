import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GalleryCategory,
  GalleryEvent,
} from "@/types/gallery";
import { baseAPI } from "@/utils/configs";

export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/gallery/` }),
  endpoints: (builder) => ({
    getGalleryItems: builder.query<{
      count: number;
      next: string | null;
      previous: string | null;
      results: GalleryEvent[];
    }, { event_type?: string; year?: number; page?: number }>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params.event_type) query.set("event_type", params.event_type);
        if (params.year) query.set("year", String(params.year));
        if (params.page) query.set("page", String(params.page));
        return `items/?${query.toString()}`;
      },
    }),
    getGalleryCategories: builder.query<GalleryCategory[], void>({
      query: () => "categories/",
    }),
    getGalleryYears: builder.query<number[], void>({
      query: () => "years/",
    }),
  }),
});

export const {
  useGetGalleryItemsQuery,
  useGetGalleryCategoriesQuery,
  useGetGalleryYearsQuery,
} = galleryApi;
