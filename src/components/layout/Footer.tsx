import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

import LogoTypo from "@public/logo_typo.svg";
import { useLocale, useTranslations } from "next-intl";

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/chariot.tools",
      icon: Instagram,
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@chariot.tools",
      icon: TikTokIcon,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@chariot_tools",
      icon: Youtube,
    },
  ];

  return (
    <footer className="bg-card text-white pt-10 py-5 -translate-y-5">
      <div className="max-w-7xl mx-auto px-4 flex flex-row justify-between items-center gap-4">
        <nav className="flex flex-col gap-2">
          <Link
            href={`/${locale}/TOU`}
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            <span className="hidden sm:block">{t("tou")}</span>
            <span className="sm:hidden block">{t("mobile.tou")}</span>
          </Link>
          <Link
            href={`/${locale}/TOS`}
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            <span className="hidden sm:block">{t("tos")}</span>
            <span className="sm:hidden block">{t("mobile.tos")}</span>
          </Link>
          <Link
            href={`/${locale}/privacyPolicy`}
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            {t("privacyPolicy")}
          </Link>
          <Link
            href={`/${locale}/legalNotice`}
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            {t("legalNotice")}
          </Link>
        </nav>
        <div className="flex flex-col gap-4 items-end">
          <Link href={`/${locale}`}>
            <Image src={LogoTypo} alt="Chariot Logo" width={120} height={40} />
          </Link>
          <Link
            href={`mailto:${process.env.NEXT_PUBLIC_RECEIVER_EMAIL}`}
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            {t("contact")}
          </Link>
          <div className="flex items-center justify-end gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="opacity-80 transition hover:opacity-100"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
