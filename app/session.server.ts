import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { authenticator } from "./auth.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function requireUserId(
  request: Request,
  returnTo: string = new URL(request.url).pathname
) {
  const searchParams = new URLSearchParams([["returnTo", returnTo]]);
  const failureRedirect = `/?${searchParams}`;
  const { id } = await authenticator.isAuthenticated(request, {
    failureRedirect,
  });

  if (!id) {
    throw redirect(failureRedirect);
  }
  return id;
}
