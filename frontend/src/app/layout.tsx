import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAJRA — Egyptian Career & Labor Market Intelligence Platform",
  description: "Understand the Egyptian tech job market, identify your skill gaps, and get matched with high-fit opportunities with data-driven career intelligence.",
  keywords: ["Egypt Tech Jobs", "Career Intelligence", "ATS Resume Builder", "Skill Gap Analysis", "Cairo Tech Jobs", "MAJRA"],
  authors: [{ name: "MAJRA Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
