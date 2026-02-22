import Link from "next/link";
import Image from "next/image";

import LogoTypo from "@public/logo_typo.svg";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-card text-white pt-10 py-5 -translate-y-5">
      <div className="max-w-7xl mx-auto px-4 flex flex-row justify-between items-center gap-4">
        <nav className="flex flex-col gap-2">
          <Link
            href="/TOU"
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            <span className="hidden sm:block">{t("tou")}</span>
            <span className="sm:hidden block">{t("mobile.tou")}</span>
          </Link>
          <Link
            href="/TOS"
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            <span className="hidden sm:block">{t("tos")}</span>
            <span className="sm:hidden block">{t("mobile.tos")}</span>
          </Link>
          <Link
            href="/privacyPolicy"
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            {t("privacyPolicy")}
          </Link>
          <Link
            href="/legalNotice"
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            {t("legalNotice")}
          </Link>
        </nav>
        <div className="flex flex-col gap-4 items-end">
          <Link href="/">
            <Image src={LogoTypo} alt="Chariot Logo" width={120} height={40} />
          </Link>
          <Link
            href={`mailto:${process.env.RECEIVER_EMAIL}`}
            className="md:text-sm text-xs hover:underline underline-offset-3"
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
