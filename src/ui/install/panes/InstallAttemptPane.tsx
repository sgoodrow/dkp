"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { ContainerCardLayout } from "@/ui/shared/components/layouts/ContainerCardLayout";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { RequirementTypography } from "@/ui/shared/components/typography/RequirementTypography";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { InstallAttemptStatus } from "@prisma/client";
import { FC } from "react";

const getInstallAttemptTitle = (status?: InstallAttemptStatus) => {
  switch (status) {
    case undefined:
    case InstallAttemptStatus.IN_PROGRESS:
      return "Installing... ⌛";
    case InstallAttemptStatus.SUCCESS:
      return "Ready ✅";
    case InstallAttemptStatus.FAIL:
      return "Failed 😔";
    default:
      exhaustiveSwitchCheck(status);
  }
};
export const InstallAttemptPane: FC<{
  status?: InstallAttemptStatus;
  installedRaces?: boolean | null;
  installedClasses?: boolean | null;
  installedRaceClassCombos?: boolean | null;
  installedItems?: boolean | null;
  installedGuild?: boolean | null;
  syncedDiscordMetadata?: boolean | null;
  onTryAgain: () => void;
}> = ({
  status,
  installedClasses,
  installedRaces,
  installedRaceClassCombos,
  installedGuild,
  installedItems,
  syncedDiscordMetadata,
  onTryAgain,
}) => {
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
      <Box height="8px">
        {status === undefined ? <LinearProgress /> : <Divider />}
      </Box>
      <Stack spacing={1}>
        <RequirementTypography label="Added Races" satisfied={installedRaces} />
        <RequirementTypography
          label="Added Classes"
          satisfied={installedClasses}
        />
        <RequirementTypography
          label="Restricted Race/Class Combinations"
          satisfied={installedRaceClassCombos}
        />
        <RequirementTypography label="Added Items" satisfied={installedItems} />
        <RequirementTypography
          label="Created Guild"
          satisfied={installedGuild}
        />
        <RequirementTypography
          label="Synced Discord"
          satisfied={syncedDiscordMetadata}
        />
      </Stack>
      {status === InstallAttemptStatus.FAIL ? (
        <>
          <Button onClick={() => onTryAgain()}>Try Again</Button>
        </>
      ) : (
        <Button
          variant="contained"
          href={uiRoutes.home.href()}
          disabled={status !== InstallAttemptStatus.SUCCESS}
        >
          Launch Application
        </Button>
      )}
    </ContainerCardLayout>
  );
};
