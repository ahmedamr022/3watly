import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "عواطلي | 3WATLY — منصة استخبارات سوق العمل والمسار المهني في مصر",
  description: "افهم متطلبات سوق العمل المصري، حدد فجوات مهاراتك وسيرتك الذاتية، واكتشف وظائف تناسبك بدقة عبر تحليلات بيانات حقيقية.",
  keywords: ["عواطلي", "3WATLY", "وظائف مصر", "استخبارات سوق العمل", "سيرة ذاتية ATS", "Egypt Tech Jobs", "Career Intelligence Egypt"],
  authors: [{ name: "فريق عواطلي | 3WATLY" }],
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
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC] dark:bg-[#060913] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
