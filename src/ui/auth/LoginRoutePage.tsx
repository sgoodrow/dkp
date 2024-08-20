import { app } from "@/shared/constants/app";
import { SignInWithProviderButton } from "@/ui/auth/buttons/SignInWithProviderButton";
import { GradientBox } from "@/ui/shared/components/boxes/GradientBox";
import { ParticlesBox } from "@/ui/shared/components/boxes/ParticlesBox";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Security } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export const LoginRoutePage = () => {
  return (
    <GradientBox>
      <ParticlesBox />
      <Dialog open hideBackdrop>
        <DialogTitle variant="h1" alignSelf="center">
          {app.name} {app.icon}
        </DialogTitle>
        <DialogContent>
          <Security
            sx={{
              fontSize: "160px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.1,
            }}
          />
          <Stack alignItems="center">
            <Typography variant="subtitle1" sx={{ pb: 3 }}>
              {app.description}
            </Typography>
            <SignInWithProviderButton
              providerName="discord"
              providerIcon={<DiscordIcon />}
              monitoringId={monitoringIds.SIGN_IN_DISCORD}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </GradientBox>
  );
};
