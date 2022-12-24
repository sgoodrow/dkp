import type { LoaderArgs } from "@remix-run/node";
import { SocialsProvider } from "remix-auth-socials";
import { authenticator } from "~/auth.server";

const decodeBase64 = (data: string) => {
  return Buffer.from(data, "base64").toString("ascii");
};

const getOAuth2State = (request: Request) => {
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  if (!state) {
    return null;
  }
  const decoded = decodeBase64(state);
  return JSON.parse(decoded);
};

export async function loader({ request }: LoaderArgs) {
  const state = getOAuth2State(request);
  return authenticator.authenticate(SocialsProvider.DISCORD, request, {
    failureRedirect: "/",
    successRedirect: state?.returnTo || "/notes",
  });
}
