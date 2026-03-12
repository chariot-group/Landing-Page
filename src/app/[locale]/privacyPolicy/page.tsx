import { Legals } from "@/components/Legals";
import type { Metadata } from "next";
import { getLegalMetadata, getLegalPageTitle } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getLegalMetadata(locale, "privacyPolicy", "/privacyPolicy");
}

export default async function privacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col items-center">
      <h1 className="container px-6 w-full mx-auto mt-25 text-3xl font-bold">
        {getLegalPageTitle(locale, "privacyPolicy")}
      </h1>
      <Legals name="privacyPolicy" />
    </div>
  );
}
