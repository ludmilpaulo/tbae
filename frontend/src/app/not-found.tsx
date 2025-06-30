"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/teambuilding-quote.htm");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 text-center px-6 animate-fadeIn">
      <div className="w-32 h-24 mb-4 animate-bounce">
        <Image src="/logo.png" alt="TBAE Logo" width={220} height={64} />
      </div>
      <h1 className="text-7xl font-extrabold text-blue-500 drop-shadow-lg">404</h1>
      <p className="mt-4 text-2xl font-bold text-yellow-700">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        Sorry, the page you’re looking for doesn’t exist.<br />
        Redirecting to the homepage...
      </p>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease;
        }
      `}</style>
    </div>
  );
}
