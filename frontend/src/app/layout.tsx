import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TBAE - Team Building Events, Venues & Activities South Africa",
    template: "%s | TBAE South Africa",
  },
  description:
    "TBAE provides fun, professional team building events and corporate activities across South Africa. Browse top venues, request quotes, and view our gallery.",
 keywords: [
    "team building Cape Town",
    "team Building Johannesburg",
    "team building pretoria",
    "team building activities",
    "team building coordinators",
    "team building facilitators",
    "teambuilding venues",
    "events management",
    "teambuilding",
    "team building",
    "teambuilding events",
    "corporate events",
    "corporate teambuilding",
    "events management south africa"
  ],
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/logo.png" }, // For Apple devices
  ],
  openGraph: {
    title: "TBAE - Team Building Events, Venues & Activities South Africa",
    description:
      "TBAE is your partner for successful team building and corporate events in South Africa. Discover venues, activities, and event inspiration.",
    url: "https://www.tbae.co.za",
    siteName: "TBAE",
    images: [
      {
        url: "/logo.png", // Should be a full URL in production, e.g. https://www.tbae.co.za/logo.png
        width: 512,
        height: 512,
        alt: "TBAE Logo",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@TBAE_SA", // Change to your real Twitter/X username if available
    title: "TBAE - Team Building Events, Venues & Activities South Africa",
    description:
      "Browse South Africa’s top team building venues and activities. Get a quote for your next event today.",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://www.tbae.co.za"),
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ShareThis */}
       
        <Script id="google-analytics-ua" strategy="afterInteractive">
          {`
            (function(){
              var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
              document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
              try {
                var pageTracker = _gat._getTracker("UA-11207940-1");
                pageTracker._trackPageview();
              } catch(err) {}
            })();
          `}
        </Script>
        {/* Add GA4 with new code instead if migrating */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
