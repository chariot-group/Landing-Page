import type { Metadata } from "next";
import { defaultLocale, Locale, locales } from "@/i18n/request";

const APP_NAME = "CHARIOT";
const DEFAULT_BASE_URL = "https://chariot.tools";
const OG_IMAGE_SIZE = { width: 1200, height: 630 };
const TWITTER_IMAGE_SIZE = { width: 1200, height: 600 };

const SEO_BY_LOCALE: Record<
  Locale,
  {
    title: string;
    description: string;
    keywords: string[];
    ogLocale: string;
    socialEyebrow: string;
    socialSubtitle: string;
    softwareFeatures: string[];
    category: string;
    classification: string;
    alternativeNames: string[];
  }
> = {
  fr: {
    title: "CHARIOT | Outil & App Jeu de Rôle pour Donjons et Dragons (DnD)",
    description:
      "Chariot est le site et l'application jeu de rôle pour Donjons et Dragons (DnD). Outil MJ pour gérer campagnes, combats, initiatives et sessions de JDR.",
    keywords: [
      "Chariot",
      "jeu de rôle",
      "application maître du jeu",
      "outil MJ",
      "gestion campagne D&D",
      "suivi combats JDR",
      "initiative tracker Donjons et Dragons",
      "outil maître du jeu Donjons et Dragons",
      "application campagne jeu de rôle",
      "chariot donjons et dragons",
      "chariot dnd",
      "chariot jeu de rôle",
      "outil jeu de rôle",
      "app jeu de rôle",
      "application jeu de rôle",
      "site jeu de rôle",
      "chariot app",
    ],
    ogLocale: "fr_FR",
    socialEyebrow: "Application & site jeu de rôle pour MJ",
    socialSubtitle:
      "Outil jeu de rôle : campagnes, combats, initiative et codex pour Donjons et Dragons (DnD) et autres JDR.",
    softwareFeatures: [
      "Gestion de campagnes de jeu de rôle",
      "Suivi d'initiative et de combats",
      "Outils narratifs pour maîtres du jeu",
      "Codex partagé pour personnages et sorts",
    ],
    category: "Logiciel de jeu de role",
    classification: "Outil pour maitres du jeu et campagnes D&D",
    alternativeNames: [
      "Chariot",
      "Chariot DnD",
      "Chariot Donjons et Dragons",
      "Chariot Jeu de Rôle",
      "Chariot App",
    ],
  },
  en: {
    title: "CHARIOT | TTRPG Tools & D&D App for Game Masters",
    description:
      "Chariot Tools is the TTRPG app for game masters. Manage Dungeons & Dragons campaigns, track combat and initiative for D&D and tabletop RPG sessions.",
    keywords: [
      "Chariot",
      "TTRPG tool",
      "D&D app",
      "game master app",
      "battle tracker",
      "initiative tracker",
      "DnD campaign manager",
      "virtual gm assistant",
      "tabletop roleplaying campaign tool",
      "chariot app",
      "chariot tools",
      "chariot tool",
      "ttrpg tools",
      "ttrpg app",
      "website app",
    ],
    ogLocale: "en_US",
    socialEyebrow: "TTRPG tools & app for game masters",
    socialSubtitle:
      "Chariot Tools: campaign management, combat tracking, initiative and codex app for D&D and other TTRPGs.",
    softwareFeatures: [
      "TTRPG campaign management",
      "Combat and initiative tracking",
      "Narrative tools for game masters",
      "Shared codex for characters and spells",
    ],
    category: "Role-playing game software",
    classification: "Game master software for D&D and TTRPG campaigns",
    alternativeNames: [
      "Chariot",
      "Chariot Tools",
      "Chariot App",
      "Chariot DnD",
      "Chariot TTRPG",
    ],
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
      "app para director de juego",
      "herramienta campañas rol de mesa",
    ],
    ogLocale: "es_ES",
    socialEyebrow: "Aplicacion web para directores de juego",
    socialSubtitle:
      "Gestiona campañas, combates, iniciativa y codex para D&D y otros juegos de rol de mesa.",
    softwareFeatures: [
      "Gestión de campañas de rol",
      "Seguimiento de combate e iniciativa",
      "Herramientas narrativas para MJ",
      "Codex compartido de personajes y conjuros",
    ],
    category: "Software de juego de rol",
    classification: "Herramienta para directores de juego y campañas de D&D",
    alternativeNames: [
      "Chariot",
      "Chariot App",
      "Chariot DnD",
      "Chariot Rol de Mesa",
    ],
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
  const rawUrl = process.env.NEXT_PUBLIC_CHARIOT_URL || DEFAULT_BASE_URL;
  try {
    return new URL(rawUrl);
  } catch {
    return new URL(DEFAULT_BASE_URL);
  }
}

function resolveLocale(locale: string): Locale {
  return locale in SEO_BY_LOCALE ? (locale as Locale) : defaultLocale;
}

function getLocalizedUrl(locale: string, pathname = "") {
  return `/${resolveLocale(locale)}${pathname}`;
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
  return SEO_BY_LOCALE[resolveLocale(locale)];
}

function getSocialImageUrl(
  locale: string,
  kind: "opengraph-image" | "twitter-image",
) {
  return getLocalizedUrl(locale, `/${kind}`);
}

function getSocialImages(locale: string, pageTitle: string) {
  const seo = getLocaleSeo(locale);

  return {
    openGraph: [
      {
        url: getSocialImageUrl(locale, "opengraph-image"),
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: `${pageTitle} - ${seo.socialSubtitle}`,
      },
    ],
    twitter: [
      {
        url: getSocialImageUrl(locale, "twitter-image"),
        width: TWITTER_IMAGE_SIZE.width,
        height: TWITTER_IMAGE_SIZE.height,
        alt: `${pageTitle} - ${seo.socialSubtitle}`,
      },
    ],
  };
}

export function getSocialImageContent(locale: string) {
  const resolvedLocale = resolveLocale(locale);
  const seo = SEO_BY_LOCALE[resolvedLocale];

  return {
    locale: resolvedLocale,
    eyebrow: seo.socialEyebrow,
    title: seo.title.replace("CHARIOT | ", ""),
    subtitle: seo.socialSubtitle,
  };
}

export function getHomepageMetadata(locale: string): Metadata {
  const seo = getLocaleSeo(locale);
  const resolvedLocale = resolveLocale(locale);
  const socialImages = getSocialImages(locale, seo.title);

  return {
    title: seo.title,
    description: seo.description,
    category: seo.category,
    classification: seo.classification,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
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
      url: getLocalizedUrl(locale),
      images: socialImages.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: socialImages.twitter,
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
  const resolvedLocale = resolveLocale(locale);
  const socialImages = getSocialImages(locale, `${pageTitle} | CHARIOT`);

  return {
    title: `${pageTitle} | CHARIOT`,
    description: `${pageTitle} - ${baseSeo.description}`,
    keywords: baseSeo.keywords,
    category: baseSeo.category,
    classification: baseSeo.classification,
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
      url: getLocalizedUrl(locale, pathname),
      images: socialImages.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | CHARIOT`,
      description: `${pageTitle} - ${baseSeo.description}`,
      images: socialImages.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function getLegalStructuredData(
  locale: string,
  page: "tou" | "tos" | "privacyPolicy" | "legalNotice",
  pathname: string,
) {
  const resolvedLocale = resolveLocale(locale);
  const seo = getLocaleSeo(locale);
  const pageTitle = getLegalPageTitle(locale, page);
  const fullTitle = `${pageTitle} | ${APP_NAME}`;
  const siteUrl = getSiteBaseUrl().origin;
  const pageUrl = `${siteUrl}/${resolvedLocale}${pathname}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: APP_NAME,
          item: `${siteUrl}/${resolvedLocale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: pageTitle,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: fullTitle,
      description: `${pageTitle} - ${seo.description}`,
      inLanguage: resolvedLocale,
      isPartOf: { "@id": `${siteUrl}#website` },
      publisher: { "@id": `${siteUrl}#organization` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    },
  ];
}

export function getHomepageStructuredData(locale: string) {
  const resolvedLocale = resolveLocale(locale);
  const seo = getLocaleSeo(locale);
  const siteUrl = getSiteBaseUrl().origin;
  const localizedUrl = `${siteUrl}${getLocalizedUrl(locale)}`;
  const logoUrl = `${siteUrl}/logo.svg`;
  const receiverEmail = process.env.NEXT_PUBLIC_RECEIVER_EMAIL;

  const organizationSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: APP_NAME,
    alternateName: seo.alternativeNames,
    url: siteUrl,
    logo: logoUrl,
    description: seo.description,
  };

  if (receiverEmail) {
    organizationSchema.email = receiverEmail;
  }

  return [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: localizedUrl,
      name: APP_NAME,
      inLanguage: resolvedLocale,
      description: seo.description,
      publisher: {
        "@id": `${siteUrl}#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: APP_NAME,
      alternateName: seo.alternativeNames,
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      isAccessibleForFree: true,
      inLanguage: resolvedLocale,
      availableLanguage: locales,
      url: localizedUrl,
      image: `${siteUrl}${getSocialImageUrl(locale, "opengraph-image")}`,
      description: seo.description,
      featureList: seo.softwareFeatures,
      genre: ["Tabletop role-playing game", "Dungeons & Dragons"],
      publisher: {
        "@id": `${siteUrl}#organization`,
      },
    },
  ];
}
