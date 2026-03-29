import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1C4ED8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://offerra.ai"),
  title: {
    default: "Offerra | Intelligent AI Job Tracking & Career Assistant",
    template: "%s | Offerra"
  },
  description: "The silent career assistant for modern professionals. Track your job applications automatically, optimize your resume with AI, and master interviews with our intelligent companion.",
  keywords: ["job tracking", "AI career assistant", "resume optimizer", "interview coach", "automated job applications", "career management", "Offerra"],
  authors: [{ name: "Offerra AI" }],
  creator: "Offerra AI",
  publisher: "Offerra AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://offerra.ai",
    siteName: "Offerra",
    title: "Offerra | AI-Powered Job Tracking & Career Success",
    description: "Automate your job search and land your dream role. Offerra intelligently tracks your applications, refactors your resume, and coaches you for interviews.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Offerra - Intelligent Job Tracking Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Offerra | AI-Powered Job Tracking",
    description: "Track your job applications and land your dream role with our AI-powered assistant.",
    images: ["/og-image.png"],
    creator: "@offerra_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "google-site-verification-placeholder", // User should update this
    yandex: "yandex-verification-placeholder",
  },
  alternates: {
    canonical: "/",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${outfit.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Offerra",
              "operatingSystem": "Web, Windows, macOS, Linux",
              "applicationCategory": "BusinessApplication",
              "description": "AI-powered job tracking and career progression platform.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1250"
              }
            })
          }}
        />
        <Toaster richColors position="top-right" />
        {children}
      </body>
    </html>
  );
}
