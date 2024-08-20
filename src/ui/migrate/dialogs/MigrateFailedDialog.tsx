import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { MaintainerLink } from "@/ui/shared/components/links/MaintainerLink";
import { RequirementTypography } from "@/ui/shared/components/typography/RequirementTypography";
import { Button, DialogContentText, Stack } from "@mui/material";
import { FC } from "react";

export const MigrateFailedDialog: FC<{
  onTryAgain: () => void;
  importedUsers: boolean | null;
  importedCharacters: boolean | null;
  importedRaidActivityTypes: boolean | null;
  importedRaidActivities: boolean | null;
}> = ({
  onTryAgain,
  importedUsers,
  importedCharacters,
  importedRaidActivityTypes,
  importedRaidActivities,
}) => {
  return (
    <FormDialog
      id="migrate-failed-dialog"
      title="😔 Migrate Failed"
      hideBackdrop
      onSubmit={onTryAgain}
      onClose={() => null}
    >
      <DialogContentText>
        Something went wrong during migration. Try again.
        <br />
        <br />
        If the issue persists, please contact <MaintainerLink />.
      </DialogContentText>
      <Stack spacing={1}>
        <RequirementTypography
          label="Imported Users"
          satisfied={importedUsers}
        />
        <RequirementTypography
          label="Imported Characters"
          satisfied={importedCharacters}
        />
        <RequirementTypography
          label="Imported Raid Activity Types"
          satisfied={importedRaidActivityTypes}
        />
        <RequirementTypography
          label="Imported Raid Activities"
          satisfied={importedRaidActivities}
        />
      </Stack>
      <Button onClick={onTryAgain}>Try Again</Button>
    </FormDialog>
  );
};
