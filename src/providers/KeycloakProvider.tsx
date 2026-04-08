"use client";

import Keycloak, { KeycloakInitOptions } from "keycloak-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setKeycloakInstance } from "@/services/api.service";
import { Locale, locales } from "@/i18n/request";
import { getStoredLocale, saveStoredLocale } from "@/hooks/useLocalPreference";
import { showToast } from "@/lib/toast";

const LOGIN_TOAST_PENDING_KEY = "chariot_login_toast_pending";
const LOGOUT_TOAST_PENDING_KEY = "chariot_logout_toast_pending";

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  loading: boolean;
  token: string | null;
  userTransitioning: boolean;
  login: () => void;
  logout: () => void;
  register: () => void;
  userId: string | null;
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  authenticated: false,
  loading: true,
  token: null,
  userTransitioning: false,
  login: () => {},
  logout: () => {},
  register: () => {},
  userId: null,
});

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("auth");

  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userTransitioning, setUserTransitioning] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const visibilityHandlerRef = useRef<(() => void) | null>(null);

  // Ref to store interval ID
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedLocale = getStoredLocale();

    if (!storedLocale || storedLocale === locale) {
      return;
    }

    if (!locales.includes(storedLocale)) {
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      segments[0] = storedLocale;
    } else {
      segments.unshift(storedLocale);
    }

    const nextPath = `/${segments.join("/")}`;
    saveStoredLocale(storedLocale);
    router.replace(nextPath);
  }, [locale, pathname, router]);

  useEffect(() => {
    const initKeycloak = async () => {
      const keycloakConfig = {
        url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
        realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "chariot",
        clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "chariot-app",
      };

      const kc = new Keycloak(keycloakConfig);

      try {
        const initOptions: KeycloakInitOptions = {
          onLoad: "check-sso", // Ne force pas la connexion
          checkLoginIframe: false,
          pkceMethod: "S256",
        };

        const authenticated = await kc.init(initOptions);

        const loginToastPending =
          sessionStorage.getItem(LOGIN_TOAST_PENDING_KEY) === "1";
        const logoutToastPending =
          sessionStorage.getItem(LOGOUT_TOAST_PENDING_KEY) === "1";

        if (authenticated && kc.tokenParsed?.sub) {
          const currentUserId = kc.tokenParsed.sub;
          setUserId(currentUserId);
          const storedUserId = localStorage.getItem("chariot_user_id");

          if (storedUserId && storedUserId !== currentUserId) {
            console.log(
              `User change detected: ${storedUserId} -> ${currentUserId}`,
            );
            setUserTransitioning(true);

            localStorage.setItem("chariot_user_id", currentUserId);

            window.dispatchEvent(
              new CustomEvent("chariot:user-changed", {
                detail: { userId: currentUserId },
              }),
            );

            setTimeout(() => {
              setUserTransitioning(false);
            }, 300);
          } else {
            localStorage.setItem("chariot_user_id", currentUserId);
          }
        } else if (!authenticated) {
          setUserId(null);
          localStorage.removeItem("chariot_user_id");
        }

        setKeycloak(kc);
        setAuthenticated(authenticated);
        setToken(kc.token || null);

        if (authenticated && loginToastPending) {
          console.log("Showing login success toast");
          showToast(t("loginSuccess"), "success");
          sessionStorage.removeItem(LOGIN_TOAST_PENDING_KEY);
        }

        if (!authenticated && logoutToastPending) {
          console.log("Showing logout success toast");
          showToast(t("logoutSuccess"), "success");
          sessionStorage.removeItem(LOGOUT_TOAST_PENDING_KEY);
        }

        setKeycloakInstance(kc);

        if (authenticated && kc.token) {
          if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
          }

          refreshIntervalRef.current = setInterval(() => {
            kc.updateToken(70)
              .then((refreshed: boolean) => {
                if (refreshed) {
                  setToken(kc.token || null);
                }
              })
              .catch(() => {
                setAuthenticated(false);
                setToken(null);
                setUserId(null);
                localStorage.removeItem("chariot_user_id");
              });
          }, 60000);
        }

        const handleVisibilityChange = () => {
          if (document.visibilityState !== "visible") return;

          kc.updateToken(70)
            .then((refreshed: boolean) => {
              if (refreshed) setToken(kc.token || null);
            })
            .catch(() => {
              setAuthenticated(false);
              setToken(null);
              setUserId(null);
              localStorage.removeItem("chariot_user_id");
            });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        visibilityHandlerRef.current = handleVisibilityChange;

        setLoading(false);
      } catch (error) {
        console.error("Keycloak initialization failed", error);
        setLoading(false);
      }
    };

    initKeycloak();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (visibilityHandlerRef.current) {
        document.removeEventListener(
          "visibilitychange",
          visibilityHandlerRef.current,
        );
      }
    };
  }, []);

  const getRedirectUri = () => {
    const redirectPathSegments = pathname.split("/").filter(Boolean);

    if (
      redirectPathSegments.length > 0 &&
      locales.includes(redirectPathSegments[0] as Locale)
    ) {
      redirectPathSegments[0] = locale;
    } else {
      redirectPathSegments.unshift(locale);
    }

    const localizedPath = `/${redirectPathSegments.join("/")}`;

    if (typeof window === "undefined") {
      return localizedPath;
    }

    return `${window.location.origin}${localizedPath}`;
  };

  const login = () => {
    sessionStorage.setItem(LOGIN_TOAST_PENDING_KEY, "1");
    sessionStorage.removeItem(LOGOUT_TOAST_PENDING_KEY);

    keycloak?.login({
      redirectUri: getRedirectUri(),
      locale: locale,
    });
  };

  const logout = async () => {
    setLoading(true);

    sessionStorage.setItem(LOGOUT_TOAST_PENDING_KEY, "1");
    sessionStorage.removeItem(LOGIN_TOAST_PENDING_KEY);

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    keycloak?.logout({
      redirectUri: getRedirectUri(),
    });
  };

  const register = () => {
    keycloak?.register({
      redirectUri: getRedirectUri(),
      locale: locale,
    });
  };

  return (
    <KeycloakContext.Provider
      value={{
        keycloak,
        authenticated,
        loading,
        token,
        userTransitioning,
        login,
        logout,
        register,
        userId,
      }}
    >
      {loading || userTransitioning ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-primary"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-8 w-8 rounded-full bg-primary/20"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white text-lg font-medium">{t("loading")}</p>
              <p className="text-white/70 text-sm">{t("pleaseWait")}</p>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </KeycloakContext.Provider>
  );
}

export function useKeycloak() {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error("useKeycloak must be used within KeycloakProvider");
  }
  return context;
}
