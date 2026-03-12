import { createSocialImage } from "@/lib/social-image";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";
export const alt = "Chariot social card";

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createSocialImage(locale, size);
}
