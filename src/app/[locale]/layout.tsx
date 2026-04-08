import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import ToastContainer from "@/components/ToastContainer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/request";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { KeycloakProvider } from "@/providers/KeycloakProvider";
import { getSharedMetadata } from "@/lib/seo";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = getSharedMetadata();

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
          <ToastContainer />
          <KeycloakProvider>
            <div className="bg-card w-full overflow-hidden">
              <Header />
              {children}
              <Footer />
            </div>
          </KeycloakProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
