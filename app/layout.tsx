import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveChat from "@/components/LiveChat";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "AG Truck Beds and Parts | Hilux & Truck Parts – Buffalo, TX",
  description:
    "AG Truck Beds and Parts specializes in quality truck beds, Hilux parts, doors, and more. Located in Buffalo, TX. Call +1(903) 650-9882 for inquiries.",
  keywords: "truck beds, hilux parts, truck parts, truck doors, Buffalo TX, AG Truck Beds",
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "AG Truck Beds and Parts",
    description: "Quality truck beds, Hilux parts, and more – Buffalo, TX",
    siteName: "AG Truck Beds and Parts",
    type: "website",
  },
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
