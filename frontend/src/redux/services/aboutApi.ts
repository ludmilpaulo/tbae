import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseAPI } from "@/utils/configs";

export interface Stat { id: number; label: string; value: number }
export interface TimelineEvent { id: number; year: number; title: string; desc: string }
export interface TeamMember { id: number; name: string; role: string; photo: string; bio?: string }
export interface About {
  id: number;
  content: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  whatsapp_url?: string;
  pinterest_url?: string;
}

export const aboutApi = createApi({
  reducerPath: "aboutApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseAPI}/api/about/` }),
  endpoints: (builder) => ({
    getAbout: builder.query<About, void>({ query: () => "" }),
    getStats: builder.query<Stat[], void>({ query: () => "stats/" }),
    getTimeline: builder.query<TimelineEvent[], void>({ query: () => "timeline/" }),
    getTeam: builder.query<TeamMember[], void>({ query: () => "team/" }),
  }),
});

export const {
  useGetAboutQuery,
  useGetStatsQuery,
  useGetTimelineQuery,
  useGetTeamQuery,
} = aboutApi;
