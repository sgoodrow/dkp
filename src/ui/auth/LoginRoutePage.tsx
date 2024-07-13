import { GradientBox } from "@/ui/auth/boxes/GradientBox";
import { ParticlesBox } from "@/ui/auth/boxes/ParticlesBox";
import { SignInWithProviderButton } from "@/ui/auth/buttons/SignInWithProviderButton";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { AppTitle } from "@/ui/shared/components/static/AppTitle";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Security } from "@mui/icons-material";
import { Paper, Stack } from "@mui/material";

export const LoginRoutePage = () => {
  return (
    <GradientBox>
      <ParticlesBox />
      <Stack
        spacing={3}
        alignItems="center"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        height={1}
        maxWidth="xs"
      >
        <Stack
          zIndex={1}
          component={Paper}
          elevation={2}
          spacing={3}
          p={3}
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{
            boxShadow: 8,
          }}
        >
          <AppTitle subtitle />
          <Security sx={{ fontSize: "48px" }} />
          <SignInWithProviderButton
            providerTitle="Discord"
            providerName="discord"
            providerIcon={<DiscordIcon />}
            monitoringId={monitoringIds.SIGN_IN_DISCORD}
          />
        </Stack>
      </Stack>
    </GradientBox>
  );
};
