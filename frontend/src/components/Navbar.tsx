'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  Squares2X2Icon,
  MapPinIcon,
  PhotoIcon,
  StarIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  // Elevate navbar on scroll for a crisp, professional feel
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/venues', label: 'Venues', icon: MapPinIcon },
    { href: '/gallery', label: 'Gallery', icon: PhotoIcon },
    { href: '/success', label: 'Success Stories', icon: StarIcon },
    { href: '/activities', label: 'Activities', icon: Squares2X2Icon },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-shadow',
        elevated ? 'shadow-lg' : 'shadow-md/0',
      ].join(' ')}
      role="banner"
    >
      {/* Gradient + subtle glass effect */}
      <div className="bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-500 relative">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        <nav
          className="relative max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3"
          aria-label="Main Navigation"
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="TBAE Home">
            <Image
              src="/logo.png"
              alt="TBAE Logo"
              width={128}
              height={52}
              className="object-contain drop-shadow-sm"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <ul className="flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={[
                        'group relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                        active
                          ? 'text-white'
                          : 'text-white/90 hover:text-white',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5 opacity-90 group-hover:opacity-100 transition" />
                      <span>{label}</span>
                      {/* Animated underline */}
                      <span
                        className={[
                          'pointer-events-none absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full transition-all',
                          active
                            ? 'bg-white scale-x-100'
                            : 'bg-white/60 scale-x-0 group-hover:scale-x-100',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Primary CTA */}
            <Link
              href="/teambuilding-quote.htm"
              className="ml-2 inline-flex items-center justify-center rounded-xl bg-white text-blue-700 px-4 py-2 text-sm font-extrabold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white/95 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {open ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={[
          'md:hidden bg-white shadow-lg border-t border-slate-100',
          open ? 'block' : 'hidden',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={[
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition',
                      active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-9 w-9 items-center justify-center rounded-lg',
                        active ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-3">
            <Link
              href="/teambuilding-quote.htm"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white px-4 py-3 text-base font-extrabold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
