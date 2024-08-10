"use client";

import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { SourceCodeLink } from "@/ui/shared/components/links/SourceCodeLink";
import { BulletList } from "@/ui/shared/components/lists/BulletList";
import { Close } from "@mui/icons-material";
import {
  AppBar,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Skeleton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { TransitionProps } from "notistack";
import { FC, forwardRef, Ref } from "react";
import { trpc } from "@/api/views/trpc/trpc";

const TITLE_ID = "about-app-dialog-title";
const DESCRIPTION_ID = "about-app-dialog-description";

const MobileTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AboutAppDialog: FC<{
  open: boolean;
  onClose: () => void;
  fullScreen: boolean;
}> = ({ open, onClose, fullScreen }) => {
  const { data: guild } = trpc.guild.get.useQuery();
  const handleClose = () => onClose();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      fullScreen={fullScreen}
      TransitionComponent={fullScreen ? MobileTransition : undefined}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            size="medium"
            onClick={handleClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2 }} variant="h4">
            Welcome 👋
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <DialogContentText id={DESCRIPTION_ID}>
          This app is used by the {guild?.name || <Skeleton width="200px" />}{" "}
          guild to manage the currency earned through their players&apos;
          contributions called <strong>DKP</strong> (&ldquo;Dragon Kill
          Points&rdquo;).
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
          <br />
          The app is maintained by <MaintainerLink /> and open source on{" "}
          <SourceCodeLink />.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
