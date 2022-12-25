import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";

import { authenticator } from "~/auth.server";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import { Form } from "@remix-run/react";
import { config } from "~/config";
import { LabeledField } from "~/components/labeledField";
import moment from "moment";
import { IntlDate } from "~/components/intlDate";
import { CustomIcon } from "~/components/customIcon";
import { paths } from "~/paths";

export const loader = async ({ request }: LoaderArgs) =>
  await authenticator.isAuthenticated(request, {
    successRedirect: paths.dashboard(),
  });

export const action = async ({ request }: ActionArgs) => {
  const url = new URL(request.url);
  return authenticator.authenticate(SocialsProvider.DISCORD, request, {
    failureRedirect: paths.loginFailure(),
    state: { returnTo: url.searchParams.get("returnTo") },
  });
};

export default () => {
  const returnTo = useLoaderData();
  const founded = moment(config.guildFounded);
  return (
    <>
      <Grid item xs={6}>
        <LabeledField label="Game" value={config.gameName} />
      </Grid>
      <Grid item xs={6}>
        <LabeledField label="Server" value={config.gameServer} />
      </Grid>
      <Grid item xs={6}>
        <LabeledField
          label="Founded"
          value={<IntlDate date={founded.toDate()} timeZone="UTC" />}
        />
      </Grid>
      <Grid item xs={6}>
        <LabeledField label="Age" value={founded.fromNow(true)} />
      </Grid>
      <Grid item xs={12}>
        <Form action={paths.login(returnTo)} method="post">
          <Tooltip
            title="A Discord account is required to participate."
            enterDelay={1000}
          >
            <Button
              fullWidth
              size="large"
              color="primary"
              type="submit"
              startIcon={
                <CustomIcon
                  src="/graphics/discord-icon.svg"
                  alt="Discord"
                  bgcolor="#5865F2"
                />
              }
            >
              <Typography>Login with Discord</Typography>
            </Button>
          </Tooltip>
        </Form>
      </Grid>
    </>
  );
};
