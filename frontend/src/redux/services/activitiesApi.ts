import { baseAPI } from "@/utils/configs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export const activitiesApi = createApi({
  reducerPath: "activitiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseAPI}),
  endpoints: (builder) => ({
    getActivityCategories: builder.query<ActivityCategory[], void>({
      query: () => "/activities/categories/",
    }),
    getActivities: builder.query<Activity[], { category?: number | string } | void>({
      query: (params) => {
        if (!params || !params.category) return "/activities/activities/";
        return `/activities/activities/?category=${params.category}`;
      },
    }),
    getActivityBySlug: builder.query<Activity, string>({
      query: (slug) => `/activities/activities/${slug}/`,
    }),
  }),
});

export const {
  useGetActivityCategoriesQuery,
  useGetActivitiesQuery,
  useGetActivityBySlugQuery,
} = activitiesApi;
