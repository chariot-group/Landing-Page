import axios, { AxiosInstance } from "axios";
import Keycloak from "keycloak-js";

let keycloakInstance: Keycloak | null = null;
type ApiClientAccess = "public" | "private";

export const setKeycloakInstance = (instance: Keycloak) => {
  keycloakInstance = instance;
};

// Create shared axios instances by access mode
let privateApiClientInstance: AxiosInstance | null = null;
let publicApiClientInstance: AxiosInstance | null = null;

const createApiClient = (access: ApiClientAccess): AxiosInstance => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error("API URL is not defined. Set NEXT_PUBLIC_API_URL in your environment.");
  }

  // Add /api prefix for gateway if URL doesn't already contain it
  const baseURL = url.endsWith('/api') ? url : `${url}/api`;

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  if (access === "public") {
    return instance;
  }

  // Request interceptor - fetches token for each request
  instance.interceptors.request.use(
    async (config) => {
      // Wait for Keycloak to be initialized
      if (typeof window !== 'undefined' && !keycloakInstance) {
        // Wait briefly for Keycloak to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Get token directly from Keycloak instance
      const token = keycloakInstance?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (typeof window !== 'undefined') {
        // If no token on client side, wait a bit more
        console.warn('⚠️ No token available yet, waiting for Keycloak initialization...');
        await new Promise(resolve => setTimeout(resolve, 500));

        const retryToken = keycloakInstance?.token;
        if (retryToken) {
          config.headers.Authorization = `Bearer ${retryToken}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
};

// Function to get instance (created once)
const apiClient = (
  contentType?: string,
  access: ApiClientAccess = "private",
): AxiosInstance => {
  const instance = access === "public"
    ? (publicApiClientInstance ??= createApiClient("public"))
    : (privateApiClientInstance ??= createApiClient("private"));

  if (contentType) {
    instance.defaults.headers.common["Content-Type"] = contentType;
  }

  return instance;
};

export default apiClient;
