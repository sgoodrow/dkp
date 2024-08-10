import { app } from "@/shared/constants/app";
import { SignInWithProviderButton } from "@/ui/auth/buttons/SignInWithProviderButton";
import { GradientBox } from "@/ui/shared/components/boxes/GradientBox";
import { ParticlesBox } from "@/ui/shared/components/boxes/ParticlesBox";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { ContainerCardLayout } from "@/ui/shared/components/layouts/ContainerCardLayout";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Security } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

export const LoginRoutePage = () => {
  return (
    <GradientBox>
      <ParticlesBox />
      <ContainerCardLayout maxWidth="xs">
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
          <Typography variant="h1">
            {app.name} {app.icon}
          </Typography>
          <Typography variant="subtitle1" sx={{ pb: 3 }}>
            {app.description}
          </Typography>
          <SignInWithProviderButton
            providerName="discord"
            providerIcon={<DiscordIcon />}
            monitoringId={monitoringIds.SIGN_IN_DISCORD}
          />
        </Stack>
      </ContainerCardLayout>
    </GradientBox>
  );
};
