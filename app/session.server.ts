import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { authenticator } from "./auth.server";
import { paths } from "./paths";
import { secrets } from "./secrets.server";

invariant(secrets.sessionSecret, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [secrets.sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export const requireUserId = async (request: Request) => {
  const returnTo = new URLSearchParams([
    ["returnTo", new URL(request.url).pathname],
  ]);
  const failureRedirect = paths.login(`${returnTo}`);
  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect,
  });

  if (!id) {
    throw redirect(failureRedirect);
  }
  return id;
};
