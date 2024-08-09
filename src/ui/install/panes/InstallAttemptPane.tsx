"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { ContainerCardLayout } from "@/ui/shared/components/layouts/ContainerCardLayout";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { RequirementTypography } from "@/ui/shared/components/typography/RequirementTypography";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { Button, Stack, Typography } from "@mui/material";
import { InstallAttempt, InstallAttemptStatus } from "@prisma/client";
import { FC } from "react";

const getInstallAttemptTitle = (status: InstallAttemptStatus) => {
  switch (status) {
    case InstallAttemptStatus.IN_PROGRESS:
      return "Installing... ⌛";
    case InstallAttemptStatus.SUCCESS:
      return "Complete 🎉";
    case InstallAttemptStatus.FAIL:
      return "Failed 😔";
    default:
      exhaustiveSwitchCheck(status);
  }
};
export const InstallAttemptPane: FC<{
  latest: InstallAttempt;
  onTryAgain: () => void;
}> = ({ latest, onTryAgain }) => {
  const {
    status,
    error,
    installedRaces,
    installedClasses,
    installedItems,
    installedGuild,
    syncedDiscordMetadata,
  } = latest;
  return (
    <ContainerCardLayout maxWidth="sm">
      <Typography sx={{ alignSelf: "center" }} variant="h1">
        {getInstallAttemptTitle(status)}
      </Typography>
      {status === InstallAttemptStatus.FAIL && (
        <Typography>
          Something went wrong during installation. Try again.
          <br />
          <br />
          If the issue persists, please contact <MaintainerLink />.
        </Typography>
      )}
      <Stack spacing={1}>
        <RequirementTypography
          label="Added Races"
          satisfied={installedRaces || false}
        />
        <RequirementTypography
          label="Added Classes"
          satisfied={installedClasses || false}
        />
        <RequirementTypography
          label="Added Items"
          satisfied={installedItems || false}
        />
        <RequirementTypography
          label="Created Guild"
          satisfied={installedGuild || false}
        />
        <RequirementTypography
          label="Synced Discord"
          satisfied={syncedDiscordMetadata || false}
        />
      </Stack>
      {status === InstallAttemptStatus.FAIL && (
        <>
          <Button onClick={() => onTryAgain()}>Try Again</Button>
        </>
      )}
      {status === InstallAttemptStatus.SUCCESS && (
        <Button variant="contained" href={uiRoutes.home.href()}>
          Launch Application
        </Button>
      )}
    </ContainerCardLayout>
  );
};
