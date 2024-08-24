"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { ActionCard } from "@/ui/shared/components/cards/ActionCard";
import { Redo } from "@mui/icons-material";
import { DialogContentText } from "@mui/material";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { uiRoutes } from "@/app/uiRoutes";

export const MigrateStartDialogBeginForm: FC<{}> = ({}) => {
  const activationKey = useActivationKey();
  const utils = trpc.useUtils();
  const { replace } = useRouter();

  const { mutate: completeInstallation } = trpc.install.complete.useMutation({
    onSuccess: () => {
      utils.invalidate();
      replace(uiRoutes.home.href());
    },
  });

  return (
    <>
      <DialogContentText>
        Congratulations, the application is almost ready!
        <br />
        <br />
        If you are coming from EQ DKP Plus, you can use this wizard to import
        users, characters and raid activities with transaction histories.
        <br />
        <br />
        Alternatively, you can skip this step. Choose carefully. To revisit this
        screen you will need to reset the application from the admin page.
      </DialogContentText>
      <ActionCard
        label="Skip migration"
        description="Migrations can only be applied on a fresh installation. You can reset the application from the admin page."
        onClick={() => completeInstallation({ activationKey })}
        Icon={Redo}
      />
    </>
  );
};
