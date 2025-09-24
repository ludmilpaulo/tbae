import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Testimonial } from "@/types/testimonial";
import { baseAPI } from "@/utils/configs";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isTestimonial = (v: unknown): v is Testimonial => {
  if (!isObject(v)) return false;
  // adjust these checks to your Testimonial shape
  const t = v as Partial<Testimonial>;
  const idOk = typeof t["id"] === "number" || typeof t["id"] === "string";
  const nameOk = typeof t["name"] === "string";
  return idOk && nameOk;
};

const isTestimonialArray = (v: unknown): v is Testimonial[] =>
  Array.isArray(v) && v.every(isTestimonial);

const isPaginatedTestimonials = (v: unknown): v is Paginated<Testimonial> =>
  isObject(v) && "results" in v && isTestimonialArray((v as Paginated<Testimonial>).results);

const toTestimonialArray = (payload: unknown): Testimonial[] => {
  if (isTestimonialArray(payload)) return payload;
  if (isPaginatedTestimonials(payload)) return payload.results;
  return []; // fallback on malformed/empty
};

export const testimonialsApi = createApi({
  reducerPath: "testimonialsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/` }),
  endpoints: (builder) => ({
    getTestimonials: builder.query<Testimonial[], void>({
      query: () => "testimonials/",
      transformResponse: (resp: unknown): Testimonial[] => toTestimonialArray(resp),
    }),
  }),
});

export const { useGetTestimonialsQuery } = testimonialsApi;
