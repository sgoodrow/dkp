import type { ActionArgs } from "@remix-run/node";
import { SocialsProvider } from "remix-auth-socials";
import { authenticator } from "~/auth.server";

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") || "/notes";
  return authenticator.authenticate(SocialsProvider.DISCORD, request, {
    failureRedirect: "/",
    state: { returnTo },
  });
}
