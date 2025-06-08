import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="font-bold text-xl text-primary">TBAE</Link>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-primary transition">About</Link>
          <Link href="/events" className="hover:text-primary transition">Events</Link>
          <Link href="/team-building" className="hover:text-primary transition">Team Building</Link>
          <Link href="/contact" className="hover:text-primary transition">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
