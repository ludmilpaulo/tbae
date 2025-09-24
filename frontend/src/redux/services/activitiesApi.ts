import { baseAPI } from "@/utils/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Domain types */
export interface ActivityCategory {
  id: number;
  name: string;
  order: number;
}
export interface Activity {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  duration: string;
  physical_intensity: string;
  main_outcomes: string;
  is_premium: boolean;
  image: string | null;
  brochure_page: number | null;
  category: ActivityCategory | null;
}

/** Helpers (no any) */
type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isActivityCategory = (v: unknown): v is ActivityCategory => {
  if (!isObject(v)) return false;
  const o = v as Partial<ActivityCategory>;
  return (
    typeof o.id === "number" &&
    typeof o.name === "string" &&
    typeof o.order === "number"
  );
};
const isActivity = (v: unknown): v is Activity => {
  if (!isObject(v)) return false;
  const o = v as Partial<Activity>;
  return (
    typeof o.id === "number" &&
    typeof o.title === "string" &&
    typeof o.slug === "string"
  );
};
const asArray = <T>(v: unknown, isT: (x: unknown) => x is T): T[] => {
  if (Array.isArray(v)) return v.filter(isT);
  if (isObject(v) && Array.isArray((v as Paginated<T>).results)) {
    return (v as Paginated<T>).results.filter(isT);
  }
  return [];
};

export const activitiesApi = createApi({
  reducerPath: "activitiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI }), // ensure baseAPI already includes your /api prefix if needed
  endpoints: (builder) => ({
    getActivityCategories: builder.query<ActivityCategory[], void>({
      query: () => "/activities/categories/",
      transformResponse: (resp: unknown) => asArray<ActivityCategory>(resp, isActivityCategory),
    }),
    getActivities: builder.query<Activity[], { category?: number | string } | void>({
      query: (params) =>
        !params || !("category" in params) || params.category === undefined
          ? "/activities/activities/"
          : `/activities/activities/?category=${params.category}`,
      transformResponse: (resp: unknown) => asArray<Activity>(resp, isActivity),
    }),
    getActivityBySlug: builder.query<Activity, string>({
      query: (slug) => `/activities/activities/${slug}/`,
      // If your detail endpoint returns the object directly, no transform needed.
    }),
  }),
});

export const {
  useGetActivityCategoriesQuery,
  useGetActivitiesQuery,
  useGetActivityBySlugQuery,
} = activitiesApi;
