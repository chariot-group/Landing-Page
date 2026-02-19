// app/api/products/route.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET() {
  try {
    const products = await stripe.products.list({
      limit: 100,
      active: true,
    });

    // Si tu veux inclure les prix associés :
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
        });
        return {
          ...product,
          prices: prices.data,
        };
      }),
    );

    return Response.json({ ...products, data: productsWithPrices });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
