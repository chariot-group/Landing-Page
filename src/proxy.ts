import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, Locale } from "./i18n/request";
import { NextRequest } from "next/server";

function getPreferredLocale(request: NextRequest): Locale | null {
  const cookieLocale = request.cookies.get("user-preferred-locale")
    ?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().split("-")[0].toLowerCase());

    for (const lang of browserLocales) {
      if (locales.includes(lang as Locale)) {
        return lang as Locale;
      }
    }
  }

  return null;
}

const intlProxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

export default function proxy(request: NextRequest) {
  const preferredLocale = getPreferredLocale(request);

  if (preferredLocale && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    return Response.redirect(url);
  }

  return intlProxy(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};