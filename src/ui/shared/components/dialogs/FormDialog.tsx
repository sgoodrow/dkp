import { FC } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

export const FormDialog: FCWithChildren<{
  id: string;
  title: string;
  onSubmit: () => void;
  onClose: () => void;
}> = ({ id, title, onSubmit, onClose, children }) => {
  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby={id}
      fullWidth
      disableRestoreFocus
      maxWidth="sm"
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
