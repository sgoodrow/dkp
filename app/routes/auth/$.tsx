import type { LoaderArgs } from "@remix-run/server-runtime";
import { authenticator } from "~/auth.server";
import { paths } from "~/paths";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: paths.dashboard(),
    failureRedirect: paths.login(),
  });
};
