"use client";

import { useGetAboutQuery, useGetStatsQuery, useGetTimelineQuery, useGetTeamQuery } from "@/redux/services/aboutApi";
import Image from "next/image";
import Link from "next/link";

// Social icon map (adjust SVGs as needed)
const icons = {
  facebook: "/social/facebook.svg",
  twitter: "/social/twitter.svg",
  instagram: "/social/instagram.svg",
  linkedin: "/social/linkedin.svg",
  youtube: "/social/youtube.svg",
  tiktok: "/social/tiktok.svg",
  whatsapp: "/social/whatsapp.svg",
  pinterest: "/social/pinterest.svg",
};

// Utility to strip HTML tags from backend content (for security & UX)
function stripHtmlTags(html: string | undefined) {
  if (!html) return "";
  // Replace block tags with line breaks, then remove tags
  return html
    .replace(/<\/(p|li|ul|ol|h[1-6]|div)>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

export default function AboutPage() {
  const { data: about } = useGetAboutQuery();
  const { data: stats = [] } = useGetStatsQuery();
  const { data: timeline = [] } = useGetTimelineQuery();
  const { data: team = [] } = useGetTeamQuery();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* ABOUT */}
      <section className="mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow">About TBAE</h1>
        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line mb-6">
          {stripHtmlTags(about?.content)}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {about &&
            Object.entries(about)
              .filter(([k, v]) => k.endsWith("_url") && v)
              .map(([k, url]) => (
                <a
                  key={k}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-50 p-2 rounded-full hover:bg-blue-100 shadow transition"
                  aria-label={k.replace("_url", "")}
                >
                  <Image
                    src={icons[k.replace("_url", "") as keyof typeof icons] || "/logo.png"}
                    alt={k.replace("_url", "")}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </a>
              ))}
        </div>
      </section>

      {/* STATS */}
      {stats.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Our Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-md p-6 flex flex-col items-center border border-blue-50 hover:shadow-lg transition"
              >
                <span className="text-4xl font-extrabold text-blue-700 mb-2 animate-bounce">{stat.value.toLocaleString()}</span>
                <span className="text-sm text-gray-700 font-semibold text-center">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="mb-14 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Our Journey</h2>
          <ol className="relative border-l-4 border-blue-600">
            {timeline.map((item, idx) => (
              <li key={item.id} className="mb-10 ml-6">
                {/* Dot */}
                <div className="absolute w-6 h-6 bg-blue-600 rounded-full -left-3 flex items-center justify-center text-white font-bold shadow">{idx + 1}</div>
                <div className="ml-4">
                  <div className="font-bold text-blue-700 text-lg">{item.year} – {item.title}</div>
                  <div className="text-gray-600 mt-1">{item.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* TEAM */}
      {team.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Meet Our Team</h2>
          <div className="flex gap-8 overflow-x-auto pb-4 justify-center">
            {team.map((person) => (
              <div
                key={person.id}
                className="min-w-[220px] flex flex-col items-center bg-white shadow rounded-xl p-4 hover:shadow-2xl border border-blue-50"
              >
                <div className="relative w-24 h-24 mb-2">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    fill
                    className="rounded-full object-cover border-4 border-blue-100 shadow"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="font-semibold text-blue-700 text-lg mt-1">{person.name}</div>
                <div className="text-sm text-gray-500">{person.role}</div>
                {person.bio && (
                  <div className="text-xs text-gray-400 mt-1 text-center">{person.bio}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAREERS CTA */}
      <section className="bg-gradient-to-r from-blue-700 via-cyan-500 to-green-400 py-12 px-6 rounded-2xl text-white text-center mt-8 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">Join Our Team</h2>
        <p className="mb-6 text-base md:text-lg">We’re always looking for passionate people. Want to help us shape unforgettable team building experiences?</p>
        <Link
          href="/careers"
          className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold shadow hover:scale-105 transition text-lg"
        >
          See Careers &amp; Opportunities
        </Link>
      </section>
    </main>
  );
}
