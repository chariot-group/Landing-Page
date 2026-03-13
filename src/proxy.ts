import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, Locale } from "./i18n/request";
import { NextRequest, NextResponse } from "next/server";

function applyNoCacheHeaders(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "private, no-store, no-cache, must-revalidate, max-age=0",
  );
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Vary", "Cookie, Accept-Language");
}

function getPreferredLocale(request: NextRequest): Locale | null {
  const cookieLocale = request.cookies.get("user-preferred-locale")
    ?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const nextIntlLocale = request.cookies.get("NEXT_LOCALE")
    ?.value as Locale | undefined;
  if (nextIntlLocale && locales.includes(nextIntlLocale)) {
    return nextIntlLocale;
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
  localeDetection: false,
});

export default function proxy(request: NextRequest) {
  const preferredLocale = getPreferredLocale(request);
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix =
    segments.length > 0 && locales.includes(segments[0] as Locale);

  if (preferredLocale && !hasLocalePrefix) {
    const url = request.nextUrl.clone();

    if (pathname === "/") {
      url.pathname = `/${preferredLocale}`;
    } else {
      url.pathname = `/${preferredLocale}${pathname}`;
    }

    const response = NextResponse.redirect(url, 307);
    applyNoCacheHeaders(response);
    response.cookies.set("user-preferred-locale", preferredLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    response.cookies.set("NEXT_LOCALE", preferredLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  }

  const response = intlProxy(request);
  applyNoCacheHeaders(response);

  if (hasLocalePrefix) {
    const routeLocale = segments[0] as Locale;
    response.cookies.set("user-preferred-locale", routeLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    response.cookies.set("NEXT_LOCALE", routeLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};