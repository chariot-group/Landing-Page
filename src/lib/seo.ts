import type { Metadata } from "next";
import { defaultLocale, Locale, locales } from "@/i18n/request";

const APP_NAME = "CHARIOT";
const DEFAULT_BASE_URL = "https://chariot.tools";

const SEO_BY_LOCALE: Record<Locale, { title: string; description: string; keywords: string[]; ogLocale: string }> = {
  fr: {
    title: "CHARIOT | Outil MJ pour Donjons & Dragons et JDR",
    description:
      "Chariot est l'application web dédiée aux Maîtres du Jeu pour Donjons & Dragons et autres jeux de rôle : campagnes, combats, initiatives et sessions simplifiés.",
    keywords: [
      "Chariot",
      "jeu de rôle",
      "application maître du jeu",
      "outil MJ",
      "gestion campagne D&D",
      "suivi combats JDR",
      "initiative tracker Donjons et Dragons",
    ],
    ogLocale: "fr_FR",
  },
  en: {
    title: "CHARIOT | Game Master Tool for D&D and TTRPG",
    description:
      "Chariot helps game masters run Dungeons & Dragons and other TTRPG sessions with campaign management, combat tracking and initiative tools.",
    keywords: [
      "Chariot",
      "TTRPG tool",
      "D&D app",
      "game master app",
      "battle tracker",
      "initiative tracker",
      "DnD campaign manager",
    ],
    ogLocale: "en_US",
  },
  es: {
    title: "CHARIOT | Herramienta para directores de juego de D&D",
    description:
      "Chariot ayuda a directores de juego de Dungeons & Dragons y otros juegos de rol de mesa con campañas, combates e iniciativa.",
    keywords: [
      "Chariot",
      "aplicación rol de mesa",
      "herramienta director de juego",
      "seguimiento combates D&D",
      "gestión de campañas D&D",
    ],
    ogLocale: "es_ES",
  },
};

const LEGAL_PAGE_TITLES: Record<Locale, Record<"tou" | "tos" | "privacyPolicy" | "legalNotice", string>> = {
  fr: {
    tou: "Conditions générales d'utilisation",
    tos: "Conditions générales de vente",
    privacyPolicy: "Politique de confidentialité",
    legalNotice: "Mentions légales",
  },
  en: {
    tou: "Terms of use",
    tos: "Terms of sale",
    privacyPolicy: "Privacy policy",
    legalNotice: "Legal notices",
  },
  es: {
    tou: "Términos de uso",
    tos: "Términos de venta",
    privacyPolicy: "Política de privacidad",
    legalNotice: "Avisos legales",
  },
};

const SHARED_METADATA: Metadata = {
  metadataBase: getSiteBaseUrl(),
  applicationName: APP_NAME,
  creator: APP_NAME,
  publisher: APP_NAME,
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
};

export function getSiteBaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE_URL;
  try {
    return new URL(rawUrl);
  } catch {
    return new URL(DEFAULT_BASE_URL);
  }
}

function getLocaleAlternates(pathname = "") {
  const alternates = locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `/${locale}${pathname}`;
    return acc;
  }, {});

  alternates["x-default"] = `/${defaultLocale}${pathname}`;

  return alternates;
}

function getAlternateOgLocales(locale: Locale) {
  return locales
    .filter((currentLocale) => currentLocale !== locale)
    .map((currentLocale) => SEO_BY_LOCALE[currentLocale].ogLocale);
}

export function getSharedMetadata(): Metadata {
  return SHARED_METADATA;
}

export function getLocaleSeo(locale: string) {
  if (locale in SEO_BY_LOCALE) {
    return SEO_BY_LOCALE[locale as Locale];
  }

  return SEO_BY_LOCALE.fr;
}

export function getHomepageMetadata(locale: string): Metadata {
  const seo = getLocaleSeo(locale);
  const resolvedLocale = locale in SEO_BY_LOCALE ? (locale as Locale) : "fr";

  return {
    ...getSharedMetadata(),
    title: seo.title,
    description: seo.description,
    robots: { index: true, follow: true },
    keywords: seo.keywords,
    alternates: {
      canonical: `/${resolvedLocale}`,
      languages: getLocaleAlternates(),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      siteName: APP_NAME,
      locale: seo.ogLocale,
      alternateLocale: getAlternateOgLocales(resolvedLocale),
      url: `/${resolvedLocale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export function getLegalPageTitle(
  locale: string,
  page: "tou" | "tos" | "privacyPolicy" | "legalNotice",
) {
  const resolvedLocale = locale in LEGAL_PAGE_TITLES ? (locale as Locale) : "fr";
  return LEGAL_PAGE_TITLES[resolvedLocale][page];
}

export function getLegalMetadata(
  locale: string,
  page: "tou" | "tos" | "privacyPolicy" | "legalNotice",
  pathname: string,
): Metadata {
  const baseSeo = getLocaleSeo(locale);
  const pageTitle = getLegalPageTitle(locale, page);
  const resolvedLocale = locale in SEO_BY_LOCALE ? (locale as Locale) : "fr";

  return {
    ...getSharedMetadata(),
    title: `${pageTitle} | CHARIOT`,
    description: `${pageTitle} - ${baseSeo.description}`,
    keywords: baseSeo.keywords,
    alternates: {
      canonical: `/${resolvedLocale}${pathname}`,
      languages: getLocaleAlternates(pathname),
    },
    openGraph: {
      title: `${pageTitle} | CHARIOT`,
      description: `${pageTitle} - ${baseSeo.description}`,
      type: "article",
      siteName: APP_NAME,
      locale: baseSeo.ogLocale,
      alternateLocale: getAlternateOgLocales(resolvedLocale),
      url: `/${resolvedLocale}${pathname}`,
    },
    robots: { index: true, follow: true },
  };
}
