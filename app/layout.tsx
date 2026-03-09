import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://agtruckparts.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AG Truck Beds and Parts | Hilux & Truck Parts – Buffalo, TX",
    template: "%s | AG Truck Beds and Parts"
  },
  description:
    "Your leading source for quality custom truck beds, Toyota Hilux parts, truck doors, and accessories. Located in Buffalo, TX. Call +1(903) 650-9882 for a quote today.",
  keywords: ["truck beds", "custom truck beds", "hilux parts", "truck parts", "toyota hilux replacements", "truck doors", "Buffalo TX", "AG Truck Beds and Parts", "flatbed truck beds"],
  authors: [{ name: "AG Truck Beds and Parts" }],
  creator: "AG Truck Beds and Parts",
  publisher: "AG Truck Beds and Parts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "AG Truck Beds and Parts | Custom Beds & Hilux Parts",
    description: "Your leading source for quality custom truck beds, Toyota Hilux parts, and accessories in Buffalo, TX.",
    url: baseUrl,
    siteName: "AG Truck Beds and Parts",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "AG Truck Beds and Parts Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AG Truck Beds and Parts | Custom Beds & Hilux Parts",
    description: "Your leading source for quality custom truck beds, Toyota Hilux parts, and accessories in Buffalo, TX.",
    images: ["/images/logo.png"],
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  "name": "AG Truck Beds and Parts",
  "image": `${baseUrl}/images/logo.png`,
  "@id": baseUrl,
  "url": baseUrl,
  "telephone": "+19036509882",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "119 F R 251",
    "addressLocality": "Buffalo",
    "addressRegion": "TX",
    "postalCode": "75831",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 31.4623,
    "longitude": -96.0601
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "08:00",
    "closes": "17:00"
  },
  "sameAs": [
    "https://www.facebook.com/agtruckbedsandparts/"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Bebas+Neue&family=Rajdhani:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <LiveChat />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
