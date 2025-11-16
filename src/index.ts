import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "./lib/auth";

export type APP_ENV = {
  Bindings: NodeJS.ProcessEnv;
};
export type AppContext = Context<APP_ENV>;

const app = new Hono<APP_ENV>();

app.use(
  "/*",
  cors({
    origin: ["*"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
);

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  const auth = getAuth(c);

  console.log("url decoded:", decodeURIComponent(c.req.url));
  const mutableRequest = new Request(c.req.raw, {
    headers: new Headers(c.req.raw.headers),
  });

  // Pass the new request with mutable headers to the auth handler
  const betterAuthResponse = await auth.handler(mutableRequest);

  return betterAuthResponse;
});

export default app;
