import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { config } from "./config";

import { theme } from "./theme";

export const links: LinksFunction = () => {
  return [];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: `${config.guildName} DKP`,
  viewport: "width=device-width,initial-scale=1",
});

const App = () => (
  <Box component="html" lang="en" sx={{ height: "100vh" }}>
    <head>
      <Meta />
      <Links />
    </head>
    <body>
      <ThemeProvider theme={theme}>
        <Box display="flex" width={1} height={1}>
          <CssBaseline />
          <Outlet />
        </Box>
      </ThemeProvider>
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </Box>
);

export default App;
