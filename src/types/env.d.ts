import { D1Database } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BETTER_AUTH_URL: string;
      PROD_D1_TUTORIAL: D1Database;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      TIKTOK_CLIENT_SECRET: string;
      TIKTOK_CLIENT_KEY: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      REDIRECT_URI: string;
    }
  }
}
