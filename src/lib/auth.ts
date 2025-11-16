import { type BetterAuthOptions, betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";
import type { AppContext } from "../index";
import { expo } from "@better-auth/expo";

export const baseAuthConfig = {
  advanced: {
    cookies: {
      session_token: {
        name: "auth-token",
        attributes: {
          domain: "backend.atomeistee.workers.dev",
        },
      },
    },
  },
  appName: "impromptertest",
} as const satisfies Omit<BetterAuthOptions, "database" | "socialProviders">;

export const getAuth = (c: AppContext) => {
  const d1Dialect = new D1Dialect({
    database: (c.env.prod_d1_tutorial as unknown as D1Database) || "",
  });

  return betterAuth({
    ...baseAuthConfig,
    trustedOrigins: [
      "https://backend.atomeistee.workers.dev",
      "impromptertest://",
    ],
    database: {
      dialect: d1Dialect,
      type: "sqlite",
    },
    plugins: [expo()],
    socialProviders: {
      google: {
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
        scope: ["openid", "email", "profile"],
      },
      tiktok: {
        clientSecret: c.env.TIKTOK_CLIENT_SECRET,
        clientKey: c.env.TIKTOK_CLIENT_KEY,
      },
      facebook: {
        clientId: c.env.FACEBOOK_CLIENT_ID,
        clientSecret: c.env.FACEBOOK_CLIENT_SECRET,
      },
    },
  });
};
