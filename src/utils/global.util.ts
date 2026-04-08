import { defaultLocale, locales, Locale } from "@/i18n/request";

export function scrollToSection(
  section: string,
  behavior: ScrollBehavior = "smooth",
) {
  const el = document.getElementById(section);
  if (el) {
    el.scrollIntoView({ behavior, block: "start" });
  } else {
    const [, maybeLocale] = window.location.pathname.split("/");
    const locale = locales.includes(maybeLocale as Locale)
      ? maybeLocale
      : defaultLocale;

    window.location.href = `/${locale}#${section}`;
  }
}

export function chariotAppUrl(locale: Locale = defaultLocale): string {
  return `${process.env.NEXT_PUBLIC_CHARIOT_URL}/${locale}`;
}