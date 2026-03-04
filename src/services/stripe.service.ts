import { Products, StripeProductWithPrices } from "@/types/stripe.type";
import apiClient from "./api.service";

interface StripeProductsResponse {
  message: string;
  data: StripeProductWithPrices[];
}

interface StripeCheckoutResponse {
  message: string;
  data: string;
}

class StripeService {
    private readonly BASE_PATH = '/stripe';

    async fetchStripeProducts(): Promise<Products> {
      try {
        const response = await apiClient().get<StripeProductsResponse>(`${this.BASE_PATH}/products`);

        // Recuper le produit avec metadonne type = "recommended"
        const recommended = response.data.data.find((product) => {
          return product.metadata?.type === "recommended";
        });

        const unit = response.data.data.find((product) => {
          return product.metadata?.type === "unit";
        });

        const other = response.data.data.filter((product) => {
          return product.metadata?.type !== "unit" && product.metadata?.type !== "recommended";
        });

        return { unit, other, recommended };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
    }

    async createStripeCheckout(packId: string, displayName: string): Promise<string> {
      try {
        const response = await apiClient().post<StripeCheckoutResponse>(`${this.BASE_PATH}/checkout`, { packId, displayName });
        return response.data.data;
      } catch (error) {
        console.error("Error creating Stripe checkout:", error);
        throw error;
      }
    }
}

export default new StripeService();

