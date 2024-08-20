"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { InstallStartDialogSetupGuildForm } from "@/ui/install/forms/InstallStartDialogSetupGuildForm";
import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { useFormSteps } from "@/ui/shared/components/dialogs/useFormSteps";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { FieldComponent, useForm } from "@tanstack/react-form";
import { FC } from "react";
import { InstallStartDialogConnectDiscordForm } from "@/ui/install/forms/InstallStartDialogConnectDiscordForm";

const steps = ["Setup Guild", "Connect Discord"] as const;
const defaultValues = {
  name: "",
  rulesLink: "",
  discordServerId: "",
  discordOwnerRoleId: "",
  discordHelperRoleId: "",
};

export type InstallStartField = FieldComponent<typeof defaultValues, undefined>;

export const InstallStartDialog: FC<{
  onSuccess: () => void;
  onError: () => void;
  isLoading: boolean;
}> = ({ onSuccess, onError, isLoading }) => {
  const activationKey = useActivationKey();
  const utils = trpc.useUtils();

  const { mutate: install, isPending: isInstalling } =
    trpc.install.start.useMutation({
      onSuccess,
      onError,
      onSettled: () => {
        utils.invalidate();
      },
    });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      return install({
        activationKey,
        name: value.name,
        rulesLink: value.rulesLink,
        discordServerId: value.discordServerId,
        discordOwnerRoleId: value.discordOwnerRoleId,
        discordHelperRoleId: value.discordHelperRoleId,
      });
    },
  });

  const { Stepper, Actions, NextButton, active, onSubmit } = useFormSteps({
    steps,
    handleSubmit,
  });

  return (
    <FormDialog
      id="install-start-dialog"
      title="Install"
      hideBackdrop
      onSubmit={onSubmit}
      onClose={() => null}
    >
      <Stepper />
      {active === "Setup Guild" ? (
        <InstallStartDialogSetupGuildForm Field={Field} />
      ) : active === "Connect Discord" ? (
        <InstallStartDialogConnectDiscordForm Field={Field} />
      ) : (
        exhaustiveSwitchCheck(active)
      )}
      <Actions>
        <Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <NextButton
              disabled={!canSubmit || isSubmitting || isInstalling || isLoading}
            />
          )}
        </Subscribe>
      </Actions>
    </FormDialog>
  );
};
