"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import Token from "@public/assets/token.svg";
import Feature from "@/components/Feature";
import { chariotAppUrl, scrollToSection } from "@/utils/global.util";
import Link from "next/link";
import { useKeycloak } from "@/providers/KeycloakProvider";
import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { Products, StripeProductWithPrices } from "@/types/stripe.type";
import StripeService from "@/services/stripe.service";
import CheckoutDisabledNotice from "@/components/CheckoutDisabledNotice";
import { Locale } from "@/i18n/request";

type PendingCheckout = {
  packId: string;
  displayName: string;
};

const PENDING_CHECKOUT_KEY = "pending_checkout";
const DISABLE_CHECKOUT_ENV =
  process.env.NEXT_PUBLIC_DISABLE_CHECKOUT === "true";

const STATIC_PRODUCTS: Products = {
  unit: {
    id: "static-unit",
    name: "custom.name",
    description: "custom.description",
    metadata: { type: "unit" },
    prices: [{ id: "static-unit-price", unit_amount: 199 }],
  } as unknown as StripeProductWithPrices,
  other: [
    {
      id: "static-explorator",
      name: "explorator.name",
      description: "explorator.description",
      metadata: { token_number: "5" },
      prices: [{ id: "static-explorator-price", unit_amount: 799 }],
    } as unknown as StripeProductWithPrices,
    {
      id: "static-legendary",
      name: "legendary.name",
      description: "legendary.description",
      metadata: { token_number: "20" },
      prices: [{ id: "static-legendary-price", unit_amount: 3999 }],
    } as unknown as StripeProductWithPrices,
  ],
  recommended: {
    id: "static-aventurer",
    name: "aventurer.name",
    description: "aventurer.description",
    metadata: { type: "recommended", token_number: "10" },
    prices: [{ id: "static-aventurer-price", unit_amount: 1399 }],
  } as unknown as StripeProductWithPrices,
};

export default function HomePageClient() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { authenticated, register, login, userId } = useKeycloak();

  const [products, setProducts] = useState<Products | undefined>(
    DISABLE_CHECKOUT_ENV ? STATIC_PRODUCTS : undefined,
  );
  const [isCheckoutDisabled, setIsCheckoutDisabled] =
    useState(DISABLE_CHECKOUT_ENV);

  useEffect(() => {
    if (DISABLE_CHECKOUT_ENV) {
      return;
    }

    StripeService.fetchStripeProducts()
      .then(setProducts)
      .catch(() => {
        setProducts(STATIC_PRODUCTS);
        setIsCheckoutDisabled(true);
      });
  }, []);

  const handleCheckout = useCallback(
    async (packId: string, displayName: string) => {
      if (isCheckoutDisabled) {
        window.alert(t("packs.unavailableAlert"));
        return;
      }

      if (!authenticated) {
        sessionStorage.setItem(
          PENDING_CHECKOUT_KEY,
          JSON.stringify({ packId, displayName }),
        );
        login();
        return;
      }
      if (!userId) {
        return;
      }
      try {
        const url = await StripeService.createStripeCheckout(
          packId,
          displayName,
        );
        window.location.href = url;
      } catch (error: unknown) {
        console.error("Erreur lors de la création du checkout Stripe:", error);
      }
    },
    [authenticated, isCheckoutDisabled, login, t, userId],
  );

  useEffect(() => {
    if (isCheckoutDisabled) {
      sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      return;
    }

    if (!authenticated || !userId) {
      return;
    }

    const pendingCheckoutRaw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!pendingCheckoutRaw) {
      return;
    }

    try {
      const pendingCheckout: PendingCheckout = JSON.parse(pendingCheckoutRaw);

      if (!pendingCheckout.packId || !pendingCheckout.displayName) {
        sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
        return;
      }

      sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      handleCheckout(pendingCheckout.packId, pendingCheckout.displayName);
    } catch {
      sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
    }
  }, [authenticated, handleCheckout, isCheckoutDisabled, userId]);

  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    callback: () => void,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const unit = products?.unit;
  const recommended = products?.recommended;

  return (
    <main className="flex flex-col bg-background">
      <section
        id="hero"
        aria-labelledby="hero-title"
        className="relative h-[90vh] bg-[url('/background.svg')] xl:bg-size-[60%] lg:bg-size-[80%] bg-cover bg-center bg-no-repeat"
      >
        <div className="flex flex-col h-[70vh] justify-end xl:max-w-5xl sm:px-10 px-2 mx-auto gap-5">
          <h1
            id="hero-title"
            className="lg:text-6xl text-4xl font-medium text-center text-shadow-sm text-shadow-white"
          >
            {t("hero.title")}
          </h1>
          <div className="flex sm:gap-4 gap-2 justify-center">
            <Button
              className="md:text-sm text-xs"
              onClick={() => scrollToSection("packs")}
            >
              <ArrowRight /> {t("hero.packs")}
            </Button>
            {authenticated ? (
              <Link href={chariotAppUrl(locale)}>
                <Button variant={"custom"}>{t("header.myAccount")}</Button>
              </Link>
            ) : (
              <Button
                onClick={register}
                className="md:text-sm text-xs"
                variant={"outline"}
              >
                {t("hero.registration")}
              </Button>
            )}
          </div>
        </div>
        <div className="absolute -z-10 -bottom-5 bg-linear-to-t from-black to-transparent h-15 w-full"></div>
      </section>
      <Card id="packs" className="p-0">
        <div className="relative lg:m-26 m-10 md:grid flex flex-col md:grid-cols-2 xl:grid-cols-4 lg:px-0 px-2 sm:px-10 md:gap-4 gap-3 max-w-6xl mx-auto self-center">
          {isCheckoutDisabled && <CheckoutDisabledNotice />}

          {unit && (
            <Card className="relative justify-between col-span-2 bg-[url('/assets/background/packs.jpg')] bg-cover bg-center bg-no-repeat">
              <div className="absolute inset-0 bg-black/30 top-0 bottom-0 z-5 rounded-[15px]"></div>
              <div className="flex flex-col gap-4 z-10">
                <h2 className="md:text-3xl text-xl font-semibold text-white">
                  {t(`packs.${unit.name}`)}
                </h2>
                <p className="md:text-sm text-xs text-white sm:w-[60%]">
                  {t(`packs.${unit.description}`)}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center z-10">
                <Button
                  type="button"
                  onClick={() =>
                    handleCheckout(unit.id, t(`packs.${unit.name}`))
                  }
                  variant={"custom"}
                  className="text-black bg-white truncate"
                >
                  <ShoppingCart aria-hidden="true" />{" "}
                  <span className="md:text-sm text-xs truncate">
                    {isCheckoutDisabled
                      ? t("packs.unavailableButton")
                      : t("packs.custom.cta")}
                  </span>
                </Button>
                <span className="md:text-sm text-xs items-center flex">
                  {unit.prices[0]?.unit_amount
                    ? (unit.prices[0].unit_amount / 100).toFixed(2)
                    : "N/A"}
                  €{" "}
                  <Image
                    src={Token}
                    alt="Char token"
                    width={15}
                    height={15}
                    className="inline-block ml-1"
                  />
                </span>
              </div>
            </Card>
          )}
          <div className="grid md:grid-rows-2 md:grid-cols-1 grid-cols-2 md:gap-4 max-[360px]:grid-cols-1 gap-3">
            {products?.other.map((product, index) => (
              <Card
                key={index}
                onClick={() =>
                  handleCheckout(product.id, t(`packs.${product.name}`))
                }
                onKeyDown={(event) =>
                  handleCardKeyDown(event, () =>
                    handleCheckout(product.id, t(`packs.${product.name}`)),
                  )
                }
                tabIndex={0}
                role="button"
                className="bg-white cursor-pointer text-black justify-between hover:bg-white/90 transition-colors duration-300 h-full"
              >
                <div className="flex flex-col gap-0">
                  <div className="flex flex-row justify-between">
                    <h2 className="md:text-3xl text-xl font-semibold w-2/3">
                      {t(`packs.${product.name}`)}
                    </h2>
                    <ArrowUpRight aria-hidden="true" />
                  </div>

                  <p className="md:text-sm text-xs text-foreground">
                    {t(`packs.${product.description}`)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold md:text-4xl text-xl flex items-center">
                    {product.metadata?.token_number}{" "}
                    <Image
                      src={Token}
                      alt="Char token"
                      className="md:h-6.25 md:w-6.25 h-4 w-4"
                      width={25}
                      height={25}
                    />
                  </span>
                  <div className="flex flex-col">
                    <span className="md:text-sm text-xs">
                      {product.prices[0]?.unit_amount
                        ? (product.prices[0].unit_amount / 100).toFixed(2)
                        : "N/A"}
                      €
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {recommended && (
            <Card
              onClick={() =>
                handleCheckout(recommended.id, t(`packs.${recommended.name}`))
              }
              onKeyDown={(event) =>
                handleCardKeyDown(event, () =>
                  handleCheckout(
                    recommended.id,
                    t(`packs.${recommended.name}`),
                  ),
                )
              }
              tabIndex={0}
              role="button"
              className="cursor-pointer relative h-full col-span-1 bg-white text-black justify-between hover:bg-white/90 transition-colors duration-300"
            >
              <Card className="absolute -top-2 -left-1 bg-primary px-2 py-1 flex flex-row items-center gap-1 rounded-full">
                <ArrowDown height={15} width={15} />
                <span className="text-white text-xs font-semibold">
                  {t("packs.recommended")}
                </span>
                <ArrowDown height={15} width={15} />
              </Card>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0">
                  <div className="flex flex-row justify-between">
                    <h2 className="md:text-3xl text-xl font-semibold w-2/3">
                      {t(`packs.${recommended.name}`)}
                    </h2>
                    <ArrowUpRight aria-hidden="true" />
                  </div>

                  <p className="md:text-sm text-xs text-foreground">
                    {t(`packs.${recommended.description}`)}
                  </p>
                </div>
                <span className="sm:flex hidden font-bold text-8xl self-center text-primary">
                  {recommended.metadata?.token_number}{" "}
                  <Image src={Token} alt="Char token" width={60} height={60} />
                </span>
              </div>

              <div className="flex flex-row sm:self-end justify-between items-center">
                <span className="flex sm:hidden font-bold text-3xl self-center text-primary">
                  {recommended.metadata?.token_number}{" "}
                  <Image src={Token} alt="Char token" width={25} height={25} />
                </span>
                <div className="flex flex-col">
                  <span className="md:text-sm text-xs">
                    {recommended.prices[0]?.unit_amount
                      ? (recommended.prices[0].unit_amount / 100).toFixed(2)
                      : "N/A"}
                    €
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card
          id="how-it-works"
          className="bg-white p-0 text-black gap-0 rounded-b-none"
        >
          <div className="xl:m-26 lg:m-15 m-10 flex flex-col gap-5 lg:grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto items-center self-center">
            <div className="justify-center items-center flex md:px-10 px-2">
              <h2 className="font-bold flex items-center justify-center lg:justify-start gap-2 flex-wrap xl:text-4xl md:text-3xl text-xl">
                <span>{t("howWorks.title1")}</span>
                <div className="flex flex-row gap-2 items-center">
                  <span>{t("howWorks.title2")}</span>
                  <Image
                    src={Token}
                    className="md:h-11.25 md:w-11.25 h-6 w-6"
                    alt="Char token"
                    width={45}
                    height={45}
                  />{" "}
                  <span>?</span>
                </div>
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:px-10 px-2">
              <p className="md:text-sm text-xs">{t("howWorks.description1")}</p>
              <p className="md:text-sm text-xs">{t("howWorks.description2")}</p>
            </div>
          </div>
          <div className="relative w-full md:h-[50vh] h-[25vh]">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px]"
              style={{
                backgroundImage: `url('/assets/background/explication.jpeg')`,
                opacity: 0.9,
              }}
            ></div>
            <div className="absolute inset-0 bg-black/60 top-0 bottom-0"></div>

            <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
              <span className="md:text-6xl text-2xl text-white font-bold flex items-center gap-2 z-10">
                <span className="flex gap-2 items-center">
                  1{" "}
                  <Image
                    src={Token}
                    className="md:h-11.25 md:w-11.25 h-6 w-6"
                    alt="Char token"
                    width={40}
                    height={40}
                  />
                </span>
                <span> = 1 {t("howWorks.session")} = </span>
                <span className="flex gap-1 items-center">
                  1{" "}
                  <UserRound
                    className="md:h-12.5 md:w-12.5 h-6 w-6"
                    width={50}
                    height={50}
                    strokeWidth={2}
                  />
                </span>
              </span>
            </div>
          </div>
          <Card id="features" className="-translate-y-5 rounded-b-none p-0">
            <div className="max-w-6xl w-full xl:px-0 md:px-10 p-2 xl:m-17 m-10 mx-auto flex flex-col gap-10 self-center">
              <div className="self-start flex flex-col gap-2">
                <h2 className="md:text-4xl text-xl font-bold">
                  {t("features.title")}
                </h2>
                <p className="md:text-sm text-xs text-foreground">
                  {t("features.description")}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mx-auto self-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto gap-2">
                  <Feature
                    title={t("features.feature1.title")}
                    description={[
                      t("features.feature1.description1"),
                      t("features.feature1.description2"),
                    ]}
                    url={"/assets/background/gestion_joueur.svg"}
                  />
                  <Feature
                    title={t("features.feature2.title")}
                    description={[
                      t("features.feature2.description1"),
                      t("features.feature2.description2"),
                    ]}
                    url={"/assets/background/mj.svg"}
                  />
                  <Feature
                    title={t("features.feature3.title")}
                    description={[
                      t("features.feature3.description1"),
                      t("features.feature3.description2"),
                    ]}
                    url={"/assets/background/initiative.svg"}
                  />
                  <Feature
                    title={t("features.feature4.title")}
                    description={[
                      t("features.feature4.description1"),
                      t("features.feature4.description2"),
                    ]}
                    url={"/assets/background/codex.svg"}
                  />
                </div>
              </div>
            </div>
            <div className="bg-linear-to-t from-black to-transparent md:py-20 pb-10 pt-5">
              <div className="flex flex-col gap-4">
                <h2 className="md:text-5xl text-2xl font-bold text-center">
                  {t("features.ready")}
                </h2>
                <div className="flex md:gap-4 gap-2 justify-center">
                  <Button
                    type="button"
                    className="md:text-sm text-xs"
                    onClick={() => scrollToSection("packs")}
                  >
                    <ArrowRight /> {t("features.packs")}
                  </Button>
                  {authenticated ? (
                    <Link href={chariotAppUrl(locale)}>
                      <Button variant={"custom"}>
                        {t("header.myAccount")}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={register}
                      className="md:text-sm text-xs"
                      variant={"outline"}
                    >
                      {t("hero.registration")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Card>
      </Card>
    </main>
  );
}
