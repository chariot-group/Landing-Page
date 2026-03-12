import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/request";
import { getSiteBaseUrl } from "@/lib/seo";

const localizedPaths = ["", "/TOU", "/TOS", "/privacyPolicy", "/legalNotice"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteBaseUrl();
  const now = new Date();

  return locales.flatMap((locale) =>
    localizedPaths.map((path) => ({
      url: `${siteUrl.origin}/${locale}${path}`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(
          locales.map((altLocale) => [
            altLocale,
            `${siteUrl.origin}/${altLocale}${path}`,
          ]),
        ),
      },
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority:
        locale === defaultLocale
          ? path === ""
            ? 1
            : 0.6
          : path === ""
            ? 0.85
            : 0.45,
    })),
  );
}
