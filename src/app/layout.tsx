import type { Metadata, Viewport } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070A11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://altafhossainraju.com"),
  title: "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
  description:
    "Official portfolio of Altaf Hossain Raju, PMP® — Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh (LCB), and executive mentor empowering 24,000+ professionals across Bangladesh.",
  keywords: [
    "Altaf Hossain Raju",
    "Altaf Hossain Raju PMP",
    "LinkedIn Community Bangladesh",
    "LCB Founder",
    "Marico Bangladesh Limited",
    "Robi Axiata",
    "Nestle Bangladesh",
    "Skill Hunt Dhaka University",
    "Career Talks Bangladesh",
    "IBA Dhaka University EMBA",
    "FMCG Leader Bangladesh",
    "Sales and Distribution Bangladesh",
    "Personal Branding Mentor"
  ],
  authors: [{ name: "Altaf Hossain Raju, PMP®" }],
  creator: "Altaf Hossain Raju, PMP®",
  openGraph: {
    title: "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
    description:
      "Explore the executive career journey, multinational FMCG leadership, and community impact of Altaf Hossain Raju, Founder of LinkedIn Community Bangladesh.",
    url: "https://altafhossainraju.com",
    siteName: "Altaf Hossain Raju, PMP® Portfolio",
    images: [
      {
        url: "/images/altaf-portrait-lcb.jpg",
        width: 1200,
        height: 630,
        alt: "Altaf Hossain Raju, PMP®",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Altaf Hossain Raju, PMP® | Corporate Leader, Entrepreneur & Mentor",
    description:
      "Area Manager at Marico Bangladesh, Founder of LinkedIn Community Bangladesh, and executive mentor.",
    images: ["/images/altaf-portrait-lcb.jpg"],
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
  alternates: {
    canonical: "https://altafhossainraju.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#070A11] text-[#CBD5E1] font-sans overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
