export const env = {
  API_URL: import.meta.env.VITE_API_URL as string,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
};

if (!env.API_URL) {
  throw new Error("VITE_API_URL is not defined");
}