import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "./lib/auth";

export type APP_ENV = {
  Bindings: CloudflareBindings;
};
export type AppContext = Context<APP_ENV>;

const app = new Hono<APP_ENV>();

// app.use(
//   "/*",
//   cors({
//     origin: ["*"],
//     allowHeaders: ["Content-Type", "Authorization"],
//     allowMethods: ["POST", "GET", "OPTIONS"],
//   })
// );

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
  const auth = getAuth(c);
  return auth.handler(c.req.raw);
});
app.on(["POST", "GET"], "/test", async (c) => {
  return new Response(JSON.stringify(c.env));
});

export default app;
