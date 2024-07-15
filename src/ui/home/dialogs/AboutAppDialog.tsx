import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { SourceCodeLink } from "@/ui/shared/components/links/SourceCodeLink";
import { SupportLink } from "@/ui/shared/components/links/SupportLink";
import { BulletList } from "@/ui/shared/components/lists/BulletList";
import { APP_TITLE, GUILD } from "@/ui/shared/components/static/copy";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";

const TITLE_ID = "about-app-dialog-title";
const DESCRIPTION_ID = "about-app-dialog-description";

export const AboutAppDialog: FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const handleClose = () => onClose();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
    >
      <DialogTitle id={TITLE_ID}>Welcome to {APP_TITLE} 👋</DialogTitle>
      <DialogContent>
        <DialogContentText id={DESCRIPTION_ID}>
          This app is used by the {GUILD} guild to manage the currency earned
          through their players&apos; contributions called <strong>DKP</strong>{" "}
          (&ldquo;Dragon Kill Points&rdquo;).
          <br />
          <br />
          On it, you can:
          <BulletList
            items={[
              "Monitor your personal DKP.",
              "Review recent raids and adjustments.",
              "See what items have recently been acquired.",
              "Track friends on the leaderboard.",
              "Observe item price history.",
            ]}
          />
          <br />
          <strong>
            If you need help, please reach out in <SupportLink />.
          </strong>
          <br />
          <br />
          The app is maintained by <MaintainerLink /> and open sourced on{" "}
          <SourceCodeLink />.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
