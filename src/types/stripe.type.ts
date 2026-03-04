import Stripe from "stripe";

export interface StripeProductWithPrices extends Stripe.Product {
    prices: Stripe.Price[];
}

export interface Products {
    unit: StripeProductWithPrices | undefined;
    other: StripeProductWithPrices[];
    recommended: StripeProductWithPrices | undefined;
}