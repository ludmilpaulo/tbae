import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAPI } from "@/utils/configs";
import type { FAQ, FAQCategory } from "@/types/faq";

type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isFAQCategory = (v: unknown): v is FAQCategory => {
  if (!isObject(v)) return false;
  const o = v as Partial<FAQCategory>;
  return typeof o.id === "number" && typeof o.name === "string";
};

const isFAQ = (v: unknown): v is FAQ => {
  if (!isObject(v)) return false;
  const o = v as Partial<FAQ>;
  return typeof o.id === "number" && typeof o.question === "string";
};

const asArray = <T>(v: unknown, guard: (x: unknown) => x is T): T[] => {
  if (Array.isArray(v)) return v.filter(guard);
  if (isObject(v) && Array.isArray((v as Paginated<T>).results)) {
    return (v as Paginated<T>).results.filter(guard);
  }
  return [];
};

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/faqs/` }),
  endpoints: (builder) => ({
    getFAQCategories: builder.query<FAQCategory[], void>({
      query: () => "categories/",
      transformResponse: (resp: unknown) => asArray<FAQCategory>(resp, isFAQCategory),
    }),
    getFAQs: builder.query<FAQ[], { category?: number; page?: number; page_size?: number }>({
      query: ({ category, page = 1, page_size = 10 }) => {
        const params = new URLSearchParams();
        if (typeof category === "number") params.set("category", String(category));
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        return `?${params.toString()}`;
      },
      transformResponse: (resp: unknown) => asArray<FAQ>(resp, isFAQ),
    }),
    askQuestion: builder.mutation<
      { success: boolean },
      { name: string; email: string; question: string }
    >({
      query: (body) => ({
        url: "ask/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetFAQCategoriesQuery,
  useGetFAQsQuery,
  useAskQuestionMutation,
} = faqApi;
