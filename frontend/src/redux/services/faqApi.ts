import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FAQ, FAQCategory } from "@/types/faq";
import { baseAPI } from "../../utils/configs"; // Set your backend API root here

export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/faqs/` }),
  endpoints: (builder) => ({
    getFAQCategories: builder.query<FAQCategory[], void>({
      query: () => "categories/",
    }),
    getFAQs: builder.query<
      FAQ[],
      { category?: number; page?: number; page_size?: number }
    >({
      query: ({ category, page = 1, page_size = 10 }) => {
        const params = new URLSearchParams();
        if (category) params.append("category", String(category));
        params.append("page", String(page));
        params.append("page_size", String(page_size));
        return `?${params.toString()}`;
      },
    }),
    // The mutation for asking a question:
    askQuestion: builder.mutation<
      { success: boolean }, // You can type the response as you wish
      { name: string; email: string; question: string }
    >({
      query: (body) => ({
        url: "ask/", // e.g., POST /api/faqs/ask/
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetFAQCategoriesQuery,
  useGetFAQsQuery,
  useAskQuestionMutation,   // <<== Export this now!
} = faqApi;
