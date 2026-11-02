import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nisarg Weds Khushi - A Celebration of Love & Happiness",
  description:
    "The official wedding celebration experience of Nisarg Weds Khushi. Journey through the grand palace and celebrate our love across Haldi, Mehndi, Sangeet, Wedding, and Reception.",
  authors: [{ name: "Nisarg Weds Khushi" }],
  keywords: [
    "Nisarg Weds Khushi",
    "Nisarg Weds Khushi Wedding",
    "Indian Royal Wedding",
    "Celebration of Love & Happiness",
    "November 2026",
  ],
  icons: {
    icon: "/assets/logo/nk-locked-logo.png",
    apple: "/assets/logo/nk-locked-logo.png",
  },
  openGraph: {
    title: "Nisarg Weds Khushi - A Celebration of Love & Happiness",
    description: "A cinematic journey through our wedding celebrations. 21 • 23 • 24 November 2026.",
    images: ["/assets/logo/nk-locked-logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0B0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${cormorant.variable} ${inter.variable} bg-charcoal-dark text-ivory antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

