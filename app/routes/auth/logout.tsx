import { Button, Grid, Typography } from "@mui/material";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { DiscordIcon } from "~/components/discordIcon";
import { RouteText } from "~/components/linkText";
import { discord } from "~/discord.server";
import { paths } from "~/paths";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: paths.login(),
  });
  try {
    const { username } = await discord.users.fetch(user.discordId);
    return username;
  } catch {
    return "unknown";
  }
};

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: paths.login() });
};

export default () => {
  const username = useLoaderData<typeof loader>();
  return (
    <>
      <Grid item xs={12}>
        Are you sure you want to log out,{" "}
        <Typography fontWeight="bold" display="inline">
          {username}
        </Typography>
        ?
      </Grid>
      <Grid item xs={12}>
        No,
        <RouteText to={paths.dashboard()} terminating hideUnderline>
          go back
        </RouteText>
        .
      </Grid>
      <Grid item xs={12}>
        <Form method="post">
          <Button
            fullWidth
            size="large"
            color="primary"
            type="submit"
            startIcon={<DiscordIcon />}
          >
            <Typography>Logout</Typography>
          </Button>
        </Form>
      </Grid>
    </>
  );
};
