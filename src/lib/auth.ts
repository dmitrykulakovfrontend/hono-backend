import { type BetterAuthOptions, betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";
import type { AppContext } from "../index";
import { expo } from "@better-auth/expo";

export const baseAuthConfig = {
  advanced: {
    cookies: {
      session_token: {
        name: "better-auth-hono-d1-auth-token",
        attributes: {
          domain: "heteropterous-lynnette-repressive.ngrok-free.dev",
          secure: true,
          sameSite: "lax",
        },
      },
    },
  },
  appName: "better-auth-hono-d1",
  trustedOrigins: ["https://heteropterous-lynnette-repressive.ngrok-free.dev"],
} as const satisfies Omit<BetterAuthOptions, "database" | "socialProviders">;

export const getAuth = (c: AppContext) => {
  const d1Dialect = new D1Dialect({
    database: (c.env.prod_d1_tutorial as unknown as D1Database) || "",
  });

  return betterAuth({
    ...baseAuthConfig,
    trustedOrigins: [
      ...baseAuthConfig.trustedOrigins, // This keeps the ngrok URL
      "impromptertest://",
      "https://xi8udou-dmitrykulakov-8081.exp.direct", // This adds your app scheme
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
        scope: ["user.info.basic"],
      },
      facebook: {
        clientId: c.env.FACEBOOK_CLIENT_ID,
        clientSecret: c.env.FACEBOOK_CLIENT_SECRET,
      },
    },
  });
};
