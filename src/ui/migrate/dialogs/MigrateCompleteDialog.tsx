"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { Button, DialogContentText } from "@mui/material";
import { useRouter } from "next/navigation";
import { FC } from "react";

export const MigrateCompleteDialog: FC<{}> = ({}) => {
  const { replace } = useRouter();
  return (
    <FormDialog
      id="migrate-complete-form"
      title="✅ Application Ready"
      hideBackdrop
      onSubmit={() => replace(uiRoutes.home.href())}
      onClose={() => null}
    >
      <DialogContentText>
        Congratulations, the migration is complete. You can now launch the
        application.
      </DialogContentText>
      <Button variant="contained" href={uiRoutes.home.href()}>
        Launch Application
      </Button>
    </FormDialog>
  );
};
