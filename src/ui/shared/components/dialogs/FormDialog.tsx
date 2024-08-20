"use client";

import { FC } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export type FormDialogProps = {
  id: string;
  title: string;
  hideBackdrop?: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

export const FormDialog: FCWithChildren<FormDialogProps> = ({
  id,
  title,
  hideBackdrop,
  onSubmit,
  onClose,
  children,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby={id}
      fullScreen={fullScreen}
      fullWidth
      disableRestoreFocus
      maxWidth="sm"
      hideBackdrop={hideBackdrop}
    >
      <DialogTitle id={id}>{title}</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
          }}
          display="flex"
          direction="column"
          spacing={2}
          mt={1}
        >
          {children}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export const FormDialogButton: FC<{
  label: string;
  disabled: boolean;
}> = ({ label, disabled }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      color="primary"
      disabled={disabled}
      fullWidth
    >
      {label}
    </Button>
  );
};

export const AssignDialogButton: FC<{
  disabled: boolean;
}> = ({ disabled }) => {
  return <FormDialogButton label="Assign" disabled={disabled} />;
};

export const CreateDialogButton: FC<{
  disabled: boolean;
}> = ({ disabled }) => {
  return <FormDialogButton label="Create" disabled={disabled} />;
};

export const ApplyDialogButton: FC<{
  disabled: boolean;
}> = ({ disabled }) => {
  return <FormDialogButton label="Apply" disabled={disabled} />;
};
