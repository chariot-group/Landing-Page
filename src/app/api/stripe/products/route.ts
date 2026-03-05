import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });
}

// Typage pour un prix Stripe
type StripePrice = Stripe.Price;

// Typage pour un produit Stripe enrichi de ses prix
interface StripeProductWithPrices extends Stripe.Product {
  prices: StripePrice[];
}

// Typage de la réponse API
interface StripeProductsResponse {
  products: StripeProductWithPrices[];
}

export async function GET() {
  try {
    const stripe = getStripeClient();
    const products = await stripe.products.list({ active: true });
    const prices = await stripe.prices.list({ active: true });

    // Associer les prix à chaque produit
    const productsWithPrices: StripeProductWithPrices[] = products.data.map((product) => ({
      ...product,
      prices: prices.data.filter((price) => price.product === product.id),
    }));

    const response: StripeProductsResponse = { products: productsWithPrices };
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
