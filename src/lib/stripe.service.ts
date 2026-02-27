export interface StripePrice {
  id: string;
  unit_amount: number | null;
  currency: string;
  product: string;
  [key: string]: any;
}

export interface StripeProductWithPrices {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  prices: StripePrice[];
  [key: string]: any;
}

export interface Products {
    unit: StripeProductWithPrices | undefined;
    other: StripeProductWithPrices[];
    recommended: StripeProductWithPrices | undefined;
}

export interface StripeProductsResponse {
  products: StripeProductWithPrices[];
}

export async function fetchStripeProducts(): Promise<Products> {
  const res = await fetch("/api/stripe/products");
  if (!res.ok) throw new Error("Erreur lors du chargement des produits Stripe");
  const data: StripeProductsResponse = await res.json();

  // Recuper le produit avec metadonne type = "recommended"
  const recommended = data.products.find((product) => {
    return product.metadata?.type === "recommended";
  });

  const unit = data.products.find((product) => {
    return product.metadata?.type === "unit";
  });

  const other = data.products.filter((product) => {
    return product.metadata?.type !== "unit" && product.metadata?.type !== "recommended";
  });

  return { unit, other, recommended };
}
