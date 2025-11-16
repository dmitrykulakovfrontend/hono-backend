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

// Step 1: Redirect user to TikTok
app.get("/auth/tiktok", (c) => {
  console.log("client_key", c.env.TIKTOK_CLIENT_KEY);
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.set("client_key", c.env.TIKTOK_CLIENT_KEY);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "user.info.basic");
  url.searchParams.set("redirect_uri", c.env.REDIRECT_URI);
  url.searchParams.set("state", "random_or_jwt");
  console.log("Redirecting to TikTok auth URL:", url.toString());
  return c.redirect(url.toString());
});

// Step 2: TikTok redirects here with code
app.get("/auth/tiktok/callback", async (c) => {
  const code = c.req.query("code");

  const tokenRes = await fetch("https://open-api.tiktok.com/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_key: c.env.TIKTOK_CLIENT_KEY,
      client_secret: c.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: c.env.REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();

  // tokenData contains: access_token, refresh_token, open_id, expires_in, etc.
  // TODO: Save tokens in your DB or generate your own session JWT.

  console.log("successful token data:", tokenData);

  return c.json({ success: true, data: tokenData });
});

app.on(["POST", "GET"], "/test", async (c) => {
  console.log(c.env);

  return new Response("Test successful");
});

export default app;
