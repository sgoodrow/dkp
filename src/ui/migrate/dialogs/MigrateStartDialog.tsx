"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { MigrateStartDialogBeginForm } from "@/ui/migrate/forms/MigrateStartDialogBeginForm";
import { MigrateStartDialogConnectSourceForm } from "@/ui/migrate/forms/MigrateStartDialogConnectSourceForm";
import { MigrateStartDialogPrepareUsersForm } from "@/ui/migrate/forms/MigrateStartDialogPrepareUsersForm";
import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { useFormSteps } from "@/ui/shared/components/dialogs/useFormSteps";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { getErrored } from "@/ui/shared/utils/formHelpers";
import { FieldComponent, useForm } from "@tanstack/react-form";
import { FC } from "react";
import { MigrateStartDialogApplyMigrationForm } from "@/ui/migrate/forms/MigrateStartDialogApplyMigrationForm";
import { MigrateStartDialogPrepareBotsForm } from "@/ui/migrate/forms/MigrateStartDialogPrepareBotsForm";

const steps = [
  "Begin",
  "Connect Source",
  "Prepare Bots",
  "Prepare Users",
  "Apply Migration",
] as const;

const defaultValues = {
  dbUrl: "",
  siteUrl: "",
  siteApiKey: "",
  botNamesCsv: "",
  usersReady: false,
};

export type MigrateStartField = FieldComponent<typeof defaultValues, undefined>;

export const MigrateStartDialog: FC<{
  onSuccess: () => void;
  onError: () => void;
  isLoading: boolean;
}> = ({ onSuccess, onError, isLoading }) => {
  const activationKey = useActivationKey();
  const utils = trpc.useUtils();

  const { mutate: startMigration, isPending: isMigrating } =
    trpc.migrate.start.useMutation({
      onSuccess,
      onError,
      onSettled: () => {
        utils.invalidate();
      },
    });

  const { useStore, Field, Subscribe, handleSubmit, setFieldValue } = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      startMigration({
        activationKey,
        dbUrl: value.dbUrl,
        botNamesCsv: value.botNamesCsv,
      });
    },
  });

  const connectSourceNextDisabled = useStore(
    (state) =>
      getErrored(state.fieldMeta.dbUrl) || getErrored(state.fieldMeta.siteUrl),
  );

  const prepareUsersNextDisabled = useStore(
    (state) => !state.values.usersReady,
  );

  const { Stepper, Actions, NextButton, active, onSubmit } = useFormSteps({
    steps,
    handleSubmit,
    disabledSteps: {
      Begin: false,
      "Connect Source": connectSourceNextDisabled,
      "Prepare Users": prepareUsersNextDisabled,
      "Prepare Bots": false,
      "Apply Migration": false,
    },
  });

  const dbUrl = useStore((state) => state.values.dbUrl);
  const siteUrl = useStore((state) => state.values.siteUrl);
  const siteApiKey = useStore((state) => state.values.siteApiKey);
  const botNamesCsv = useStore((state) => state.values.botNamesCsv);

  return (
    <FormDialog
      id="migrate-start-dialog"
      title="🚀 Migrate"
      hideBackdrop
      onSubmit={onSubmit}
      onClose={() => null}
    >
      <Stepper />
      {active === "Begin" ? (
        <MigrateStartDialogBeginForm />
      ) : active === "Connect Source" ? (
        <MigrateStartDialogConnectSourceForm
          Field={Field}
          dbUrl={dbUrl}
          siteUrl={siteUrl}
          siteApiKey={siteApiKey}
        />
      ) : active === "Prepare Users" ? (
        <MigrateStartDialogPrepareUsersForm
          Field={Field}
          dbUrl={dbUrl}
          siteUrl={siteUrl}
          siteApiKey={siteApiKey}
          onPreparedUsersChange={(usersReady) =>
            setFieldValue("usersReady", usersReady)
          }
        />
      ) : active === "Prepare Bots" ? (
        <MigrateStartDialogPrepareBotsForm Field={Field} />
      ) : active === "Apply Migration" ? (
        <MigrateStartDialogApplyMigrationForm
          siteUrl={siteUrl}
          dbUrl={dbUrl}
          botNamesCsv={botNamesCsv}
        />
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
              disabled={!canSubmit || isSubmitting || isMigrating || isLoading}
            />
          )}
        </Subscribe>
      </Actions>
    </FormDialog>
  );
};
