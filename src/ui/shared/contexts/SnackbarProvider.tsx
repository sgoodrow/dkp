"use client";

import { SECONDS } from "@/shared/constants/time";
import { Alert, AlertTitle, Card, Typography } from "@mui/material";
import {
  SnackbarProvider as NotistackProvider,
  closeSnackbar,
  CustomContentProps,
  SnackbarContent,
  CustomAlertSnackbarProps,
} from "notistack";
import { FC, forwardRef, PropsWithChildren } from "react";

const AlertSnackbar = forwardRef<
  HTMLDivElement,
  CustomContentProps & CustomAlertSnackbarProps
>(function Inner({ variant, title, message, id }, forwardedRef) {
  return (
    <SnackbarContent ref={forwardedRef}>
      <Card raised sx={{ maxWidth: 400 }}>
        <Alert
          severity={variant}
          onClose={() => closeSnackbar(id)}
          variant="outlined"
          aria-label={title}
        >
          <Typography variant="body1" component="div">
            {!!title && (
              <AlertTitle sx={{ fontWeight: "bold" }}>{title}</AlertTitle>
            )}
            {message}
          </Typography>
        </Alert>
      </Card>
    </SnackbarContent>
  );
});

export const SnackbarProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NotistackProvider
      Components={{
        error: AlertSnackbar,
        warning: AlertSnackbar,
        info: AlertSnackbar,
        success: AlertSnackbar,
      }}
      anchorOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      maxSnack={3}
      autoHideDuration={3 * SECONDS}
      disableWindowBlurListener
    >
      {children}
    </NotistackProvider>
  );
};
