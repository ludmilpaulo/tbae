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
} from "react-icons/fa";

type SocialKey =
  | "facebook_url"
  | "twitter_url"
  | "instagram_url"
  | "linkedin_url"
  | "youtube_url"
  | "tiktok_url"
  | "whatsapp_url"
  | "pinterest_url";

const SOCIAL_ICON_MAP: Record<SocialKey, React.ReactNode> = {
  facebook_url: <FaFacebookF className="w-6 h-6" />,
  twitter_url: <FaTwitter className="w-6 h-6" />,
  instagram_url: <FaInstagram className="w-6 h-6" />,
  linkedin_url: <FaLinkedinIn className="w-6 h-6" />,
  youtube_url: <FaYoutube className="w-6 h-6" />,
  tiktok_url: <FaTiktok className="w-6 h-6" />,
  whatsapp_url: <FaWhatsapp className="w-6 h-6" />,
  pinterest_url: <FaPinterestP className="w-6 h-6" />,
};

// Colorful styles for each network:
const SOCIAL_COLOR_MAP: Record<SocialKey, string> = {
  facebook_url: "bg-[#3b5998] hover:ring-[#3b5998]/40",
  twitter_url: "bg-[#1da1f2] hover:ring-[#1da1f2]/40",
  instagram_url: "bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 hover:ring-pink-400/40",
  linkedin_url: "bg-[#0077b5] hover:ring-[#0077b5]/40",
  youtube_url: "bg-[#ff0000] hover:ring-[#ff0000]/40",
  tiktok_url: "bg-gradient-to-r from-black via-pink-600 to-gray-800 hover:ring-pink-400/40",
  whatsapp_url: "bg-[#25d366] hover:ring-[#25d366]/40",
  pinterest_url: "bg-[#cb2027] hover:ring-[#cb2027]/40",
};

export default function Footer() {
   const { data: about } = useGetAboutQuery();
  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Social Media Section */}
        <div className="flex flex-col items-center md:items-start justify-center space-y-4">
          <h2 className="text-xl font-bold mb-2">Connect with us</h2>
          <div className="flex gap-6 mt-2">
            {about &&
            (Object.entries(about) as [SocialKey, string | null][])
              .filter(([k, v]) => k.endsWith("_url") && v)
              .map(([k, url]) =>
                url ? (
                  <a
                    key={k}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 flex items-center justify-center rounded-full text-white shadow-md p-2 transition-all duration-200 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 ${SOCIAL_COLOR_MAP[k]}`}
                    aria-label={k.replace("_url", "")}
                    tabIndex={0}
                  >
                    {SOCIAL_ICON_MAP[k]}
                  </a>
                ) : null
              )}
          </div>
        </div>

        {/* Help & Legal */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Help & Info</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about" className="hover:underline">About Us</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <h3 className="text-lg font-semibold">Get In Touch</h3>
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

      <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} TBAE. All rights reserved.
      </div>
    </footer>
  );
}
