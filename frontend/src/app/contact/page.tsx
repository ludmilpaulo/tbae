"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTumblr,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/logo.png"
          alt="TBAE Logo"
          width={76}
          height={76}
          className="mb-3"
          priority
        />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3 text-center drop-shadow">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center max-w-lg">
          We’re here to help! Send us your enquiry, suggestion, or request and our team will get back to you promptly.
        </p>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-xl p-0 overflow-hidden ring-1 ring-blue-100">
        {/* Modern iframe container */}
        <div className="w-full h-[700px] flex items-center justify-center bg-gradient-to-tr from-blue-50 via-cyan-50 to-blue-100">
          <iframe
            title="TBAE Quote request"
            src="https://tbaeza.clientary.com/forms/139151/docview"
            width="100%"
            height="700"
            scrolling="no"
            frameBorder={0}
            allowTransparency={true}
            style={{
              border: "none",
              minHeight: 700,
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Contact details and Social Icons */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        <div>
          Or email us at{" "}
          <a
            href="mailto:info@tbae.co.za"
            className="text-blue-600 underline font-semibold hover:text-blue-800"
          >
            info@tbae.co.za
          </a>
        </div>
        <div>
          Tel:{" "}
          <a
            href="tel:+27836599911"
            className="text-blue-600 underline font-semibold hover:text-blue-800"
          >
            +27836599911
          </a>
        </div>
        <h2 className="text-xl font-bold my-6 text-blue-700">Connect with us</h2>
        <div className="flex flex-wrap gap-3 justify-center items-center mt-2">
          <SocialIcon
            href="https://www.facebook.com/teambuildingandevents"
            ariaLabel="Facebook"
            className="bg-[#3b5998] hover:ring-[#3b5998]/30"
          >
            <FaFacebookF />
          </SocialIcon>
          <SocialIcon
            href="https://instagram.com/tbaeza"
            ariaLabel="Instagram"
            className="bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 hover:ring-pink-400/30"
          >
            <FaInstagram />
          </SocialIcon>
          <SocialIcon
            href="https://twitter.com/tbaesa"
            ariaLabel="Twitter"
            className="bg-[#65c8fa] hover:ring-[#65c8fa]/30"
          >
            <FaTumblr />
          </SocialIcon>
          <SocialIcon
            href="http://www.pinterest.com/tbaeevents/"
            ariaLabel="Pinterest"
            className="bg-[#cb2027] hover:ring-[#cb2027]/30"
          >
            <FaPinterestP />
          </SocialIcon>
          <SocialIcon
            href="http://www.linkedin.com/company/tbae-team-building-and-events"
            ariaLabel="LinkedIn"
            className="bg-[#0077b5] hover:ring-[#0077b5]/30"
          >
            <FaLinkedinIn />
          </SocialIcon>
          <SocialIcon
            href="https://www.youtube.com/user/TBAETeamBuilding"
            ariaLabel="YouTube"
            className="bg-[#ff0000] hover:ring-[#ff0000]/30"
          >
            <FaYoutube />
          </SocialIcon>
        </div>
      </div>
    </main>
  );
}

/**
 * Social icon button – Accessible, styled, and animated
 */
function SocialIcon({
  href,
  ariaLabel,
  className,
  children,
}: {
  href: string;
  ariaLabel: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`
        w-11 h-11 flex items-center justify-center rounded-full text-white shadow-md p-2
        hover:scale-110 hover:ring-4 focus:ring-4 transition-all duration-200 text-2xl
        outline-none focus:outline-none ${className}
      `}
      tabIndex={0}
    >
      {children}
    </Link>
  );
}
