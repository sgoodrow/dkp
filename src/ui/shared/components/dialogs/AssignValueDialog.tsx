import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { FC } from "react";

export const AssignValueDialog: FCWithChildren<{
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

export const AssignButton: FC<{
  disabled: boolean;
}> = ({ disabled }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      color="primary"
      disabled={disabled}
      fullWidth
    >
      Assign
    </Button>
  );
};
