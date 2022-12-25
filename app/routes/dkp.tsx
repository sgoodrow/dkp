import { Outlet } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { authenticator } from "~/auth.server";
import { Navigation } from "~/containers/navigation";
import { discord } from "~/discord.server";
import { paths } from "~/paths";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: paths.login(),
  });
  try {
    const { username } = await discord.users.fetch(user.discordId);
    return { username };
  } catch {
    return { username: "unknown" };
  }
};

export default () => {
  return (
    <Navigation>
      <>
        <Outlet />
      </>
    </Navigation>
  );
};
