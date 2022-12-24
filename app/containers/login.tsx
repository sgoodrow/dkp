import type { LoaderArgs } from "@remix-run/node";

import { authenticator } from "~/auth.server";
import { Box, Button, Grid, Paper, Tooltip, Typography } from "@mui/material";
import { Form } from "@remix-run/react";
import { config } from "~/config";
import { LabeledField } from "~/components/labeledField";
import moment from "moment";
import { IntlDate } from "~/components/intlDate";
import type { FC } from "react";
import { CustomIcon } from "~/components/customIcon";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/notes",
  });
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");
  return returnTo;
}

export const Login: FC<{
  action: string;
}> = ({ action }) => {
  const founded = moment(config.FOUNDED);
  return (
    <Box width={1} p={3} elevation={3} borderRadius={3} component={Paper}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h3">{config.GUILD_NAME} DKP</Typography>
            <Box ml={1} />
            <CustomIcon
              src={config.GUILD_ICON}
              alt="Guild Icon"
              bgcolor="white"
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <LabeledField label="Game" value={config.GAME} />
        </Grid>
        <Grid item xs={6}>
          <LabeledField label="Server" value={config.SERVER} />
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
          <Form action={action} method="post">
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
      </Grid>
    </Box>
  );
};
