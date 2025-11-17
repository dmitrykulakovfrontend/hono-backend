import { type BetterAuthOptions, betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";
import type { AppContext } from "../index";
import { expo } from "@better-auth/expo";

export const getAuth = (c: AppContext) => {
  const d1Dialect = new D1Dialect({
    database: (c.env.prod_d1_tutorial as unknown as D1Database) || "",
  });

  return betterAuth({
    social: {
      callbackUrl: "https://backend.atomeistee.workers.dev/api/auth/callback",
    },
    advanced: {
      cookies: {
        session_token: {
          attributes: {
            sameSite: "none",
            secure: true,
          },
        },
        session_data: {
          attributes: {
            sameSite: "none",
            secure: true,
          },
        },
      },
      defaultCookieAttributes: {
        // This is the key change for cross-site cookies
        sameSite: "none",
        // The Secure flag is MANDATORY when SameSite=None
        secure: true,
        // Partitioned is a new attribute that is good practice for cross-site
        // and is often required by newer browser standards (CHIPS).
        partitioned: true,
      },
    },
    trustedOrigins: [
      "http://localhost:8081",
      "https://backend.atomeistee.workers.dev",
      "exp://",
      "impromptertest://",
      "*.exp.direct",
    ],
    database: {
      dialect: d1Dialect,
      type: "sqlite",
    },
    plugins: [expo({ disableOriginOverride: true })],
    socialProviders: {
      google: {
        clientId: c.env.GOOGLE_CLIENT_ID,
        clientSecret: c.env.GOOGLE_CLIENT_SECRET,
      },
      tiktok: {
        clientSecret: c.env.TIKTOK_CLIENT_SECRET,
        clientKey: c.env.TIKTOK_CLIENT_KEY,
      },
    },
  } as BetterAuthOptions);
};
