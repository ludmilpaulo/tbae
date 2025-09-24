// src/redux/services/galleryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAPI } from "@/utils/configs";
import type { GalleryCategory, GalleryEvent } from "@/types/gallery";

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const isGalleryCategory = (v: unknown): v is GalleryCategory => {
  if (!isObject(v)) return false;
  const o = v as Partial<GalleryCategory>;
  return (
    (typeof o.id === "number" || typeof o.id === "string") &&
    typeof o.name === "string"
  );
};

const asArray = <T>(v: unknown, guard: (x: unknown) => x is T): T[] => {
  if (Array.isArray(v)) return v.filter(guard);
  if (isObject(v) && Array.isArray((v as Paginated<T>).results)) {
    return (v as Paginated<T>).results.filter(guard);
  }
  return [];
};

const asNumberArray = (v: unknown): number[] => {
  if (Array.isArray(v)) return v.filter((x): x is number => typeof x === "number");
  if (isObject(v) && Array.isArray((v as Paginated<number>).results)) {
    return (v as Paginated<number>).results.filter((x): x is number => typeof x === "number");
  }
  return [];
};

export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/gallery/` }),
  endpoints: (builder) => ({
    getGalleryItems: builder.query<
      { count: number; next: string | null; previous: string | null; results: GalleryEvent[] },
      { event_type?: string; year?: number; page?: number }
    >({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.event_type) q.set("event_type", params.event_type);
        if (typeof params?.year === "number") q.set("year", String(params.year));
        if (typeof params?.page === "number") q.set("page", String(params.page));
        const s = q.toString();
        return `items/${s ? `?${s}` : ""}`;
      },
      // If your items endpoint can wrap results differently, normalize here.
      transformResponse: (resp: unknown) => {
        if (isObject(resp) && Array.isArray((resp as { results?: unknown[] }).results)) {
          // assume server already gives proper shape
          return resp as { count: number; next: string | null; previous: string | null; results: GalleryEvent[] };
        }
        // minimal empty fallback
        return { count: 0, next: null, previous: null, results: [] as GalleryEvent[] };
      },
    }),
    getGalleryCategories: builder.query<GalleryCategory[], void>({
      query: () => "categories/",
      transformResponse: (resp: unknown) => asArray<GalleryCategory>(resp, isGalleryCategory),
    }),
    getGalleryYears: builder.query<number[], void>({
      query: () => "years/",
      transformResponse: (resp: unknown) => asNumberArray(resp),
    }),
  }),
});

export const {
  useGetGalleryItemsQuery,
  useGetGalleryCategoriesQuery,
  useGetGalleryYearsQuery,
} = galleryApi;
