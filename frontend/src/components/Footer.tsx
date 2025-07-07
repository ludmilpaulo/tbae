"use client";
import Link from "next/link";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useGetAboutQuery } from "@/redux/services/aboutApi";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa6"; // v6 for best icons
import { JSX } from "react";

type SocialKey =
  | "facebook_url"
  | "twitter_url"
  | "instagram_url"
  | "linkedin_url"
  | "youtube_url"
  | "tiktok_url"
  | "whatsapp_url"
  | "pinterest_url";

const SOCIAL_ICON_MAP: Record<SocialKey, JSX.Element> = {
  facebook_url: <FaFacebookF />,
  twitter_url: <FaTwitter />,
  instagram_url: <FaInstagram />,
  linkedin_url: <FaLinkedinIn />,
  youtube_url: <FaYoutube />,
  tiktok_url: <FaTiktok />,
  whatsapp_url: <FaWhatsapp />,
  pinterest_url: <FaPinterestP />,
};

const SOCIAL_COLOR_MAP: Record<SocialKey, string> = {
  facebook_url: "bg-[#3b5998] hover:bg-[#2d4373]",
  twitter_url: "bg-[#1da1f2] hover:bg-[#1482b3]",
  instagram_url: "bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 hover:opacity-90",
  linkedin_url: "bg-[#0077b5] hover:bg-[#005983]",
  youtube_url: "bg-[#ff0000] hover:bg-[#b20000]",
  tiktok_url: "bg-gradient-to-r from-black via-pink-600 to-gray-800 hover:opacity-90",
  whatsapp_url: "bg-[#25d366] hover:bg-[#128c7e]",
  pinterest_url: "bg-[#cb2027] hover:bg-[#7c111c]",
};

export default function Footer() {
  const { data: about } = useGetAboutQuery();
  const socialLinks =
    about &&
    (Object.entries(about) as [SocialKey, string | null][])
      .filter(([k, v]) => k.endsWith("_url") && v)
      .map(([k, url]) =>
        url ? (
          <a
            key={k}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 text-2xl ${SOCIAL_COLOR_MAP[k]} ring-0 hover:ring-4 focus:outline-none focus:ring-4 focus:ring-blue-300`}
            aria-label={k.replace("_url", "")}
            tabIndex={0}
          >
            {SOCIAL_ICON_MAP[k]}
          </a>
        ) : null
      );

  return (
    <footer className="bg-gradient-to-tr from-blue-700 via-blue-500 to-cyan-400 text-white pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-0 justify-between items-center md:items-start">
        {/* Left: Socials */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Connect with us</h2>
          <div className="flex flex-wrap gap-5 mb-2">
            {socialLinks}
          </div>
        </div>

        {/* Middle: Help & Info */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3">Help & Info</h3>
          <ul className="space-y-2 text-white/90 text-base">
            <li>
              <Link href="/about" className="hover:underline transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline transition-colors">Contact</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline transition-colors">FAQs</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline transition-colors">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline transition-colors">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Right: Contact Info */}
        <div className="flex-1 flex flex-col items-center md:items-end mt-6 md:mt-0">
          <h3 className="text-xl font-bold mb-3">Get In Touch</h3>
          <div className="flex flex-col gap-3 text-white/90 text-base">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              <span>info@tbae.co.za</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              <span>+27 (0)636590489</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-5 h-5 mt-1" />
              <span>1st Floor, Trescoe House, Riverstone Rd, Kenilworth, Cape Town, 7945</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-white/20 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} TBAE. All rights reserved.
      </div>
    </footer>
  );
}
