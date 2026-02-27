import { detectBrowserLocale, saveStoredLocale } from "@/hooks/useLocalPreference";

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

export function chariotAppUrl(): string {
  const detectedLocale = detectBrowserLocale();
  saveStoredLocale(detectedLocale);

  return `${process.env.NEXT_PUBLIC_CHARIOT_URL}/${detectedLocale}`;
}