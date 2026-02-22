import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ToastContainer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/request";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHARIOT - Modern dungeon master tool",
  description:
    "Chariot est l'application web dédiée aux Maîtres du Jeu de Donjons & Dragons et autres jeux de rôle. Organisez vos parties, suivez les combats, gérez vos campagnes. Intuitif, multilingue et pensé pour les MJ en présentiel.",
  applicationName: "CHARIOT",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  authors: [
    {
      name: "Hugo Piedanna",
      url: "https://piedanna.dev/",
    },
    {
      name: "Elvis Pichou",
      url: "https://www.linkedin.com/in/elvis-pichou/",
    },
  ],
  robots: { index: true, follow: true },
  keywords: [
    // Marque
    "Chariot",
    "Chariot JDR",
    "Chariot TTRPG",
    "Chariot app",
    "Chariot MJ",
    "Chariot game master tool",

    // Français (FR)
    "jeu de rôle",
    "application maître du jeu",
    "outil MJ",
    "gestion campagne D&D",
    "outil de gestion JDR",
    "suivi combats JDR",
    "init tracker Donjons et Dragons",

    // Anglais (EN)
    "TTRPG tool",
    "D&D app",
    "game master app",
    "battle tracker",
    "initiative tracker",
    "DnD campaign manager",
    "tool for dungeon master",

    // Espagnol (ES)
    "aplicación rol de mesa",
    "herramienta director de juego",
    "seguimiento combates D&D",
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${interTight.variable} w-full antialiased font-sans h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="bg-card w-full overflow-hidden">
            <Header />
            <ToastContainer />
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
