import { APP_TITLE } from "@/ui/shared/components/static/copy";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC, useId } from "react";

export const AboutAppDialog: FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const titleId = `about-app-dialog-title-${useId()}`;
  const descriptionId = `about-app-dialog-description-${useId()}`;
  const handleClose = () => onClose();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <DialogTitle id={titleId}>Welcome to {APP_TITLE} 👋</DialogTitle>
      <DialogContent>
        <DialogContentText id={descriptionId}>
          This application can be used to...
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
