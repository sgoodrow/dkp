"use client";

import { Suspense } from "react";
import { SnackbarProvider } from "@/ui/shared/contexts/SnackbarProvider";
import { QueryParamProvider } from "use-query-params";
import NextAdapterApp from "next-query-params/app";
import { ThemeProvider } from "@/ui/shared/contexts/ThemeProvider";
import { TrpcProvider } from "@/ui/shared/contexts/TrpcProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from "next-auth/react";

/*
 * A wrapper of React Context Providers (https://react.dev/reference/react/useContext) that are made
 * available to the client (browser).
 */
export const ClientProviders: FCWithChildren = ({ children }) => {
  return (
    <SessionProvider>
      <TrpcProvider>
        <ThemeProvider>
          <SnackbarProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Suspense>
                <QueryParamProvider adapter={NextAdapterApp}>
                  {children}
                </QueryParamProvider>
              </Suspense>
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </TrpcProvider>
    </SessionProvider>
  );
};
