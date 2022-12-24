import type { LoaderArgs } from "@remix-run/node";

import { authenticator } from "~/auth.server";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import { Container } from "@mui/system";
import { theme } from "~/theme";
import { Login } from "~/containers/login";
import { GradientBackground } from "~/components/gradientBackground";

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
      <GradientBackground>
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
          <Login action={encodeURI(action)} />
        </Container>
      </GradientBackground>
    </ThemeProvider>
  );
}
