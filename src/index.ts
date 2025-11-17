import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "./lib/auth";

// Define the environment types (assuming CloudflareBindings exists)
export type APP_ENV = {
  Bindings: CloudflareBindings; // Assuming CloudflareBindings is defined in your Worker config
};
export type AppContext = Context<APP_ENV>;

const app = new Hono<APP_ENV>();

// Define the list of origins that are allowed to make cross-origin requests
// This list is expanded to explicitly include the deployed domain for maximum compatibility.
const TRUSTED_ORIGINS = [
  "http://localhost:8081",
  "https://backend.atomeistee.workers.dev",
];

app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (!origin) return "*"; // native apps

      // Allow all Expo dev origins
      if (origin.endsWith(".exp.direct")) {
        return origin;
      }

      // Allow local dev
      if (origin.startsWith("http://localhost")) {
        return origin;
      }

      // Allow your own backend domain
      if (origin === "https://backend.atomeistee.workers.dev") {
        return origin;
      }

      return ""; // block everything else
    },
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
);

app.use("*", async (c, next) => {
  const origin = c.req.header("Origin");

  c.header("Access-Control-Allow-Origin", origin);
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // CORS preflight
  if (c.req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  return next();
});

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  const auth = getAuth(c);
  // The betterAuth handler returns the final Response object
  return auth.handler(c.req.raw);
});

app.on(["POST", "GET"], "/test", async (c) => {
  return new Response(JSON.stringify(c.env));
});

export default app;
