import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Telugu, Noto_Sans_Tamil, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LangProvider } from "../lib/i18n/LangProvider";
import TopStrip from "../components/TopStrip";
import { getSchemes } from "../lib/data";
import { latestLastVerified, formatCheckedDate } from "../lib/scheme-date";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-telugu",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-noto-tamil",
});

const newsreader = Newsreader({ subsets: ["latin"], weight: ["500", "600"], display: "swap", variable: "--font-newsreader" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Haq Sahayak",
  description: "Demo uses sample user data",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const checkedDate = formatCheckedDate(latestLastVerified(getSchemes()));
  return (
    <html lang="te" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoTelugu.variable} ${notoTamil.variable} ${newsreader.variable} ${plexMono.variable} font-sans flex min-h-screen flex-col`}
      >
        <LangProvider>
          <TopStrip checkedDate={checkedDate} />
          <Header />
          <main className="min-h-screen max-w-md mx-auto px-4">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
