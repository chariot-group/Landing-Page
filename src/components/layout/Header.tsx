"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import LogoTypo from "@public/logo_typo.svg";
import Link from "next/link";
import { chariotAppUrl, scrollToSection } from "@/utils/global.util";
import { useState } from "react";
import { useKeycloak } from "@/providers/KeycloakProvider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

interface item {
  libelle: string;
  id: string;
}

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const t = useTranslations("header");
  const locale = useLocale();
  const { authenticated, login, register, logout } = useKeycloak();

  const buttons: item[] = [
    { libelle: `${t("home")}`, id: "hero" },
    { libelle: `${t("packs")}`, id: "packs" },
    { libelle: `${t("howWorks")}`, id: "how-it-works" },
    { libelle: `${t("features")}`, id: "features" },
  ];

  return (
    <header className="xl:px-15 px-10 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-black to-transparent">
      <div className="flex items-center gap-15">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="xl:hidden">
            <Button variant="outline" aria-label="Open menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Link href={`/${locale}`}>
                <Image
                  src={LogoTypo}
                  alt="Chariot Logo"
                  width={120}
                  height={40}
                />
              </Link>
            </SheetHeader>
            <nav className="flex flex-col gap-5">
              <ul className="flex flex-col gap-2">
                {buttons.map((item, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className="h-9 px-4 py-2 cursor-pointer hover:text-primary transition-colors duration-300 text-left w-full"
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsSheetOpen(false);
                      }}
                    >
                      {item.libelle}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t mx-4"></div>
              <div className="flex flex-wrap gap-2 px-4 py-2">
                {authenticated ? (
                  <React.Fragment>
                    <Button variant={"outline"} onClick={logout}>
                      {t("logout")}
                    </Button>
                    <Link href={chariotAppUrl()}>
                      <Button variant={"custom"}>{t("myAccount")}</Button>
                    </Link>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button variant={"outline"} onClick={register}>
                      {t("registration")}
                    </Button>
                    <Button variant={"custom"} onClick={login}>
                      {t("connection")}
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href={`/${locale}`} className="flex">
          <Image src={LogoTypo} alt="Chariot Logo" width={120} height={40} />
        </Link>
        <h1 className="sr-only">Chariot</h1>
        <nav className="hidden xl:flex">
          <ul className="flex gap-2 mt-2">
            {buttons.map((button) => (
              <li key={button.id}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => scrollToSection(button.id)}
                >
                  {button.libelle}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="hidden xl:flex gap-2">
        {authenticated ? (
          // Afficher un avatar simple (exemple générique)
          <React.Fragment>
            <Button variant={"outline"} onClick={logout}>
              {t("logout")}
            </Button>
            <Link href={chariotAppUrl()}>
              <Button variant={"custom"}>{t("myAccount")}</Button>
            </Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button variant={"outline"} onClick={register}>
              {t("registration")}
            </Button>
            <Button variant={"custom"} onClick={login}>
              {t("connection")}
            </Button>
          </React.Fragment>
        )}
      </div>
    </header>
  );
}
