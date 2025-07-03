import Link from "next/link";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaInstagram,
  FaTumblr,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Social Media Section */}
        <div className="flex flex-col items-center md:items-start justify-center space-y-4">
          <h2 className="text-xl font-bold mb-2">Connect with us</h2>
          <div className="flex gap-6 mt-2">
            <Link href="https://facebook.com/" target="_blank" aria-label="Facebook">
              <FaFacebookF className="w-10 h-10 rounded-full p-2 bg-[#3b5998] hover:scale-110 transition transform duration-200" />
            </Link>
            <Link href="https://instagram.com/" target="_blank" aria-label="Instagram">
              <FaInstagram className="w-10 h-10 rounded-full p-2 bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 hover:scale-110 transition transform duration-200" />
            </Link>
            <Link href="https://tumblr.com/" target="_blank" aria-label="Tumblr">
              <FaTumblr className="w-10 h-10 rounded-full p-2 bg-[#65c8fa] hover:scale-110 transition transform duration-200" />
            </Link>
            <Link href="https://pinterest.com/" target="_blank" aria-label="Pinterest">
              <FaPinterestP className="w-10 h-10 rounded-full p-2 bg-[#cb2027] hover:scale-110 transition transform duration-200" />
            </Link>
            <Link href="https://linkedin.com/" target="_blank" aria-label="LinkedIn">
              <FaLinkedinIn className="w-10 h-10 rounded-full p-2 bg-[#0077b5] hover:scale-110 transition transform duration-200" />
            </Link>
            <Link href="https://youtube.com/" target="_blank" aria-label="YouTube">
              <FaYoutube className="w-10 h-10 rounded-full p-2 bg-[#ff0000] hover:scale-110 transition transform duration-200" />
            </Link>
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
