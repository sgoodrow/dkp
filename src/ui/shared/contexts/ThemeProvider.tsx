"use client";

import { theme } from "@/ui/theme/theme";
import {
  CssBaseline,
  Experimental_CssVarsProvider,
  getInitColorSchemeScript,
} from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Mode } from "@mui/system/cssVars/useCurrentColorScheme";

const DEFAULT_THEME_MODE: Mode = "dark";

export const ThemeProvider: FCWithChildren = ({ children }) => {
  return (
    <AppRouterCacheProvider>
      <Experimental_CssVarsProvider
        theme={theme}
        defaultMode={DEFAULT_THEME_MODE}
      >
        {/*
         * This is a workaround to ensure SSR render works correctly.
         * See: https://github.com/mui/material-ui/issues/39010
         */}
        {getInitColorSchemeScript({
          // These properties are normally set when importing from @mui/material,
          // but we have to set manually because we are importing from @mui/system.
          attribute: "data-mui-color-scheme",
          modeStorageKey: "mui-mode",
          colorSchemeStorageKey: "mui-color-scheme",
          // All options that you pass to CssVarsProvider you should also pass here.
          defaultMode: DEFAULT_THEME_MODE,
        })}
        <CssBaseline />
        {children}
      </Experimental_CssVarsProvider>
    </AppRouterCacheProvider>
  );
};
