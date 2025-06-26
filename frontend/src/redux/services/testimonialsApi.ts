import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Testimonial } from "@/types/testimonial";
import { baseAPI } from "@/utils/configs";

export const testimonialsApi = createApi({
  reducerPath: "testimonialsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/` }), // Assumes /api/testimonials/
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], void>({
      query: () => "testimonials/",
    }),
  }),
});

export const { useGetTestimonialsQuery } = testimonialsApi;
