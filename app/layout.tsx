import type { Metadata } from "next";
import { Inter, Noto_Sans_Telugu, Noto_Sans_Tamil } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { LangProvider } from "../lib/i18n/LangProvider";

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

export const metadata: Metadata = {
  title: "Haq Sahayak",
  description: "Demo uses sample user data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="te" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoTelugu.variable} ${notoTamil.variable} font-sans flex min-h-screen flex-col`}
      >
        <LangProvider>
          <Header />
          <main className="min-h-screen max-w-md mx-auto px-4">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
