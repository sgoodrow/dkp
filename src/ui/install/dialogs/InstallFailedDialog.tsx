import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { RequirementTypography } from "@/ui/shared/components/typography/RequirementTypography";
import { Button, DialogContentText, Stack } from "@mui/material";
import { FC } from "react";

export const InstallFailedDialog: FC<{
  onTryAgain: () => void;
  installedRaces: boolean | null;
  installedClasses: boolean | null;
  installedRaceClassCombinations: boolean | null;
  installedItems: boolean | null;
  installedGuild: boolean | null;
}> = ({
  onTryAgain,
  installedRaces,
  installedClasses,
  installedRaceClassCombinations,
  installedItems,
  installedGuild,
}) => {
  return (
    <FormDialog
      id="install-failed-dialog"
      title="😔 Install Failed"
      hideBackdrop
      onSubmit={onTryAgain}
      onClose={() => null}
    >
      <DialogContentText>
        Something went wrong during installation. Try again.
        <br />
        <br />
        If the issue persists, please contact <MaintainerLink />.
      </DialogContentText>
      <Stack spacing={1}>
        <RequirementTypography label="Added Races" satisfied={installedRaces} />
        <RequirementTypography
          label="Added Classes"
          satisfied={installedClasses}
        />
        <RequirementTypography
          label="Restricted Race/Class Combinations"
          satisfied={installedRaceClassCombinations}
        />
        <RequirementTypography label="Added Items" satisfied={installedItems} />
        <RequirementTypography
          label="Created Guild"
          satisfied={installedGuild}
        />
      </Stack>
      <Button onClick={onTryAgain}>Try Again</Button>
    </FormDialog>
  );
};
