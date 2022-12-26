import { Grid } from "@mui/material";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { authenticator } from "~/auth.server";
import { AnchorText, RouteText } from "~/components/linkText";
import { paths } from "~/paths";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: paths.dashboard(),
  });
};

export default () => (
  <>
    <Grid item xs={12}>
      Something went wrong while trying to login. Is
      <AnchorText to="https://discordstatus.com/">Discord</AnchorText>
      down?
    </Grid>
    <Grid item xs={12}>
      Try logging in
      <RouteText to={paths.login()} terminating>
        again
      </RouteText>
      .
    </Grid>
  </>
);
