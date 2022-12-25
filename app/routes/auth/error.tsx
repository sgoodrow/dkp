import { Grid } from "@mui/material";
import { AnchorText, RouteText } from "~/components/linkText";
import { paths } from "~/paths";

export default () => (
  <>
    <Grid item xs={12}>
      Something went wrong while trying to login. Is
      <AnchorText text="Discord" to="https://discordstatus.com/" />
      down?
    </Grid>
    <Grid item xs={12}>
      Try logging in
      <RouteText to={paths.login()} text="again" terminating />.
    </Grid>
  </>
);
