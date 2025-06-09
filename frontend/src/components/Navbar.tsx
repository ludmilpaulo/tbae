import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="font-bold text-xl text-blue-600">TBAE</Link>
        <div className="flex gap-6">
          <Link href="/events" className="hover:text-blue-600">Events</Link>
          <Link href="/venues" className="hover:text-blue-600">Venues</Link>
          <Link href="/gallery" className="hover:text-blue-600">Gallery</Link>
          <Link href="/testimonials" className="hover:text-blue-600">Testimonials</Link>
          <Link href="/dashboard" className="hover:text-blue-600">My Dashboard</Link>
          <Link href="/admin" className="hover:text-blue-600 font-bold">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
