'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  MapPinIcon,
  PhotoIcon,
  StarIcon,
 // UserCircleIcon,
 // Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon, special: false },
    { href: "/events.htm", label: "Events", icon: CalendarDaysIcon, special: false },
    { href: "/venues", label: "Venues", icon: MapPinIcon, special: false },
    { href: "/gallery", label: "Gallery", icon: PhotoIcon, special: false },
    { href: "/success", label: "Success Stories", icon: StarIcon, special: false }, // new
   // { href: "/dashboard", label: "My Dashboard", icon: UserCircleIcon, special: false },
  //  { href: "/admin", label: "Admin", icon: Cog6ToothIcon, special: true },
  ];
  

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="TBAE Logo"
            width={120}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8">
          {navItems.map(({ href, label, icon: Icon, special }) => (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white transition-colors duration-300 ${
                  pathname === href
                    ? "bg-white bg-opacity-20 font-semibold"
                    : "hover:bg-white hover:bg-opacity-10"
                } ${special ? "bg-white text-teal-600 hover:text-teal-700" : ""}`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            </Link>
          ))}
        </div>
        {/* Mobile */}
        <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide">
          {navItems.map(({ href, icon: Icon }) => (
            <Link key={href} href={href}>
              <div
                className={`p-2 rounded-lg ${
                  pathname === href
                    ? "bg-white bg-opacity-30"
                    : "hover:bg-white hover:bg-opacity-20"
                }`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
