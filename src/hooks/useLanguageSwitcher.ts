import { Locale, locales } from "@/i18n/request";
import { saveStoredLocale } from "@/hooks/useLocalPreference";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const localeToRegion: Record<Locale, string> = {
  fr: "FR",
  en: "GB",
  es: "ES",
};

const localeToFlag: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
};

const localeNameFallback: Record<Locale, Record<Locale, string>> = {
  fr: { fr: "France", en: "Royaume-Uni", es: "Espagne" },
  en: { fr: "France", en: "United Kingdom", es: "Spain" },
  es: { fr: "Francia", en: "Reino Unido", es: "España" },
};

function getLocaleLabel(loc: Locale, currentLocale: Locale) {
  const region = localeToRegion[loc];
  const countryDisplayNames =
    typeof Intl !== "undefined" && "DisplayNames" in Intl
      ? new Intl.DisplayNames([currentLocale], { type: "region" })
      : null;

  const countryName =
    countryDisplayNames?.of(region) ?? localeNameFallback[currentLocale][loc];

  return `${localeToFlag[loc]} ${countryName}`;
}

export function useLanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: string) {
    if (!locales.includes(nextLocale as Locale)) return;

    const targetLocale = nextLocale as Locale;

    if (targetLocale === locale) return;

    const segments = pathname.split("/").filter(Boolean);

    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }

    const nextPath = `/${segments.join("/")}`;

    saveStoredLocale(targetLocale);
    router.push(nextPath);
  }

  const languageOptions = locales.map((loc) => ({
    value: loc,
    label: getLocaleLabel(loc, locale),
  }));

  return {
    locale,
    languageOptions,
    switchLocale,
  };
}
