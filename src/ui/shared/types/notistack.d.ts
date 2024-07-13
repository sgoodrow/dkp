import { AlertProps } from "@mui/material";

// As of notistack v3.0.1, this is officially documented way to implement custom variants mapping:
// https://notistack.com/features/customization#custom-variant-(typescript)
declare module "notistack" {
  type CustomAlertSnackbarProps = {
    variant: AlertProps["severity"];
    title?: string;
  };

  interface VariantOverrides {
    error: CustomAlertSnackbarProps;
    warning: CustomAlertSnackbarProps;
    info: CustomAlertSnackbarProps;
    success: CustomAlertSnackbarProps;
  }
}
