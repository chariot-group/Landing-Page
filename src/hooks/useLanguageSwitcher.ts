import { Locale, locales } from "@/i18n/request";
import { saveStoredLocale } from "@/hooks/useLocalPreference";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const localeToFlag: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
};

const languageNameFallback: Record<Locale, Record<Locale, string>> = {
  fr: { fr: "Français", en: "Anglais", es: "Espagnol" },
  en: { fr: "French", en: "English", es: "Spanish" },
  es: { fr: "Francés", en: "Inglés", es: "Español" },
};

function uppercaseFirstLetter(value: string) {
  if (!value) return value;

  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

function getLocaleLabel(loc: Locale, currentLocale: Locale) {
  const languageDisplayNames =
    typeof Intl !== "undefined" && "DisplayNames" in Intl
      ? new Intl.DisplayNames([currentLocale], { type: "language" })
      : null;

  const languageName =
    languageDisplayNames?.of(loc) ?? languageNameFallback[currentLocale][loc];

  return `${localeToFlag[loc]} ${uppercaseFirstLetter(languageName)}`;
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
