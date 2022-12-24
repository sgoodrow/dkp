import type { LoaderArgs } from "@remix-run/node";

import { authenticator } from "~/auth.server";
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  Icon,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "~/theme";
import { Form, useLoaderData } from "@remix-run/react";
import { Container } from "@mui/system";
import { config } from "~/config";
import { LabeledField } from "~/components/labeledField";
import moment from "moment";
import { IntlDate } from "~/components/intlDate";

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/notes",
  });
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");
  return returnTo;
}

export default function Index() {
  const returnTo = useLoaderData();
  let action = "/auth/login";
  if (returnTo) {
    action += `?returnTo=${returnTo}`;
  }
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" height={1} flexDirection="column">
        <CssBaseline />
        <Container
          maxWidth="sm"
          sx={{
            height: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            width={1}
            p={2}
            component={Paper}
            display="flex"
            flexDirection="column"
          >
            <Typography variant="h3" sx={{ alignSelf: "center" }}>
              {config.GUILD_NAME}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <LabeledField label="Game" value={config.GAME} />
              </Grid>
              <Grid item xs={6}>
                <LabeledField label="Server" value={config.SERVER} />
              </Grid>
              <Grid item xs={6}>
                <LabeledField
                  label="Founded"
                  value={
                    <IntlDate
                      date={moment(config.FOUNDED).toDate()}
                      timeZone="UTC"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Box m={1} />
            <Form action={encodeURI(action)} method="post">
              <Button
                fullWidth
                size="large"
                color="primary"
                type="submit"
                endIcon={
                  <Icon>
                    <img src="/graphics/discord-icon.svg" alt="Discord" />
                  </Icon>
                }
                sx={{ alignSelf: "center" }}
              >
                Login
              </Button>
            </Form>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
