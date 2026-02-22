"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import LogoTypo from "@public/logo_typo.svg";
import Link from "next/link";
import { getRegistrationUrl, scrollToSection } from "@/utils/global.util";
import { use, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface item {
  libelle: string;
  id: string;
}

export default function Header() {
  const [registrationUrl, setRegistrationUrl] = useState<string>("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const t = useTranslations("header");

  const buttons: item[] = [
    { libelle: `${t("home")}`, id: "hero" },
    { libelle: `${t("packs")}`, id: "packs" },
    { libelle: `${t("howWorks")}`, id: "how-it-works" },
    { libelle: `${t("features")}`, id: "features" },
  ];

  useEffect(() => {
    setRegistrationUrl(getRegistrationUrl());
  }, []);

  return (
    <header className="xl:px-15 px-10 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-black to-transparent">
      <div className="flex items-center gap-15">
        <Link href="/" className="flex">
          <Image src={LogoTypo} alt="Chariot Logo" width={120} height={40} />
        </Link>
        <h1 className="sr-only">Chariot</h1>
        <nav className="hidden xl:flex">
          <ul className="flex gap-2 mt-2">
            {buttons.map((button) => (
              <li key={button.id} onClick={() => scrollToSection(button.id)}>
                <Button variant="outline">{button.libelle}</Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="hidden xl:flex gap-2">
        <Link href={registrationUrl}>
          <Button variant={"outline"}>{t("registration")}</Button>
        </Link>

        <Link href={process.env.NEXT_PUBLIC_LOGIN_URL || "#"}>
          <Button variant={"custom"}>{t("connection")}</Button>
        </Link>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild className="xl:hidden">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <Link href="/">
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
                <li
                  key={index}
                  className="h-9 px-4 py-2 cursor-pointer hover:text-primary transition-colors duration-300"
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsSheetOpen(false);
                  }}
                >
                  {item.libelle}
                </li>
              ))}
            </ul>
            <div className="border-t mx-4"></div>
            <div className="flex flex-row gap-2 px-4 py-2">
              <Link href={registrationUrl}>
                <Button variant={"outline"}>{t("registration")}</Button>
              </Link>

              <Link href={process.env.NEXT_PUBLIC_LOGIN_URL || "#"}>
                <Button variant={"custom"}>{t("connection")}</Button>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
