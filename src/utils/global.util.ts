import { defaultLocale, Locale } from "@/i18n/request";

export function scrollToSection(
  section: string,
) {
  const el = document.getElementById(section);
  if (el) {
    const topOffset = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: topOffset - 100,
      behavior: "smooth",
    });
  } else {
    window.location.href = `/#${section}`;
  }
}

export function chariotAppUrl(locale: Locale = defaultLocale): string {
  return `${process.env.NEXT_PUBLIC_CHARIOT_URL}/${locale}`;
}