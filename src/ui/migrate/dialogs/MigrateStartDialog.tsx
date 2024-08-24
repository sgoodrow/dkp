"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { useActivationKey } from "@/ui/shared/contexts/ActivationKeyContext";
import { MigrateStartDialogBeginForm } from "@/ui/migrate/forms/MigrateStartDialogBeginForm";
import { MigrateStartDialogConnectSourceForm } from "@/ui/migrate/forms/MigrateStartDialogConnectSourceForm";
import { FormDialog } from "@/ui/shared/components/dialogs/FormDialog";
import { useFormSteps } from "@/ui/shared/components/dialogs/useFormSteps";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { getErrored } from "@/ui/shared/utils/formHelpers";
import { FieldComponent, useForm } from "@tanstack/react-form";
import { FC } from "react";
import { MigrateStartDialogSetupBotsForm } from "@/ui/migrate/forms/MigrateStartDialogSetupBotsForm";
import { useRouter } from "next/navigation";
import { uiRoutes } from "@/app/uiRoutes";
import { DialogContentText, List } from "@mui/material";
import { MigrateUsersListItem } from "@/ui/migrate/list/MigrateUsersListItem";
import { MigrateRaidActivityTypesListItem } from "@/ui/migrate/list/MigrateRaidActivityTypesListItem";
import { MigrateCharactersListItem } from "@/ui/migrate/list/MigrateCharactersListItem";
import { MigrateRaidActivitiesListItem } from "@/ui/migrate/list/MigrateRaidActivitiesListItem";
import { ReactErrorBoundary } from "@/ui/shared/boundaries/ReactErrorBoundary";

const steps = [
  "Begin",
  "Connect Source",
  "Setup Bots",
  "Complete Migration",
] as const;

const defaultValues = {
  dbUrl: "",
  siteUrl: "",
  siteApiKey: "",
  botNamesCsv: "",
  usersReady: false,
  charactersReady: false,
  invalidCharactersOk: false,
  raidActivityTypesReady: false,
  raidActivitiesReady: false,
};

export type MigrateStartField = FieldComponent<typeof defaultValues, undefined>;

export const MigrateStartDialog: FC<{}> = ({}) => {
  const { replace } = useRouter();

  const activationKey = useActivationKey();
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.install.complete.useMutation({
    onSuccess: () => {
      utils.invalidate();
      replace(uiRoutes.home.href());
    },
  });

  const { useStore, Field, Subscribe, handleSubmit, setFieldValue, reset } =
    useForm({
      defaultValues,
      onSubmit: async () => {
        mutate({ activationKey });
      },
    });

  const connectSourceNextDisabled = useStore(
    (state) =>
      getErrored(state.fieldMeta.dbUrl) || getErrored(state.fieldMeta.siteUrl),
  );

  const completeMigrationNextDisabled = useStore(
    (state) =>
      !state.values.usersReady ||
      !state.values.charactersReady ||
      !state.values.raidActivityTypesReady ||
      !state.values.raidActivitiesReady,
  );

  const { Stepper, Actions, NextButton, active, onSubmit } = useFormSteps({
    steps,
    handleSubmit,
    disabledSteps: {
      Begin: false,
      "Connect Source": connectSourceNextDisabled,
      "Setup Bots": false,
      "Complete Migration": completeMigrationNextDisabled,
    },
  });

  const dbUrl = useStore((state) => state.values.dbUrl);
  const siteUrl = useStore((state) => state.values.siteUrl);
  const siteApiKey = useStore((state) => state.values.siteApiKey);
  const botNamesCsv = useStore((state) => state.values.botNamesCsv);
  const usersReady = useStore((state) => state.values.usersReady);
  const charactersReady = useStore((state) => state.values.charactersReady);
  const invalidCharactersOk = useStore(
    (state) => state.values.invalidCharactersOk,
  );
  const raidActivityTypesReady = useStore(
    (state) => state.values.raidActivityTypesReady,
  );

  return (
    <FormDialog
      id="migrate-start-dialog"
      title="🚀 Migrate"
      hideBackdrop
      onSubmit={onSubmit}
      onClose={() => null}
    >
      <Stepper />
      <ReactErrorBoundary>
        {active === "Begin" ? (
          <MigrateStartDialogBeginForm />
        ) : active === "Connect Source" ? (
          <MigrateStartDialogConnectSourceForm
            Field={Field}
            dbUrl={dbUrl}
            siteUrl={siteUrl}
            siteApiKey={siteApiKey}
          />
        ) : active === "Setup Bots" ? (
          <MigrateStartDialogSetupBotsForm Field={Field} />
        ) : active === "Complete Migration" ? (
          <>
            <DialogContentText>
              Please stand by until the migration is complete.
            </DialogContentText>
            <List disablePadding dense={false}>
              <MigrateUsersListItem
                Field={Field}
                enabled
                dbUrl={dbUrl}
                siteUrl={siteUrl}
                siteApiKey={siteApiKey}
                onReadyChange={(ready) => {
                  setFieldValue("usersReady", ready);
                }}
              />
              <MigrateRaidActivityTypesListItem
                Field={Field}
                enabled={usersReady}
                dbUrl={dbUrl}
                onReadyChange={(ready) => {
                  setFieldValue("raidActivityTypesReady", ready);
                }}
              />
              <MigrateCharactersListItem
                Field={Field}
                enabled={usersReady && raidActivityTypesReady}
                botNamesCsv={botNamesCsv}
                invalidCharactersOk={invalidCharactersOk}
                dbUrl={dbUrl}
                siteUrl={siteUrl}
                resetForm={reset}
                onReadyChange={(ready) => {
                  setFieldValue("charactersReady", ready);
                }}
              />
              <MigrateRaidActivitiesListItem
                Field={Field}
                enabled={
                  usersReady && raidActivityTypesReady && charactersReady
                }
                dbUrl={dbUrl}
                onReadyChange={(ready) => {
                  setFieldValue("raidActivitiesReady", ready);
                }}
              />
            </List>
          </>
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
              <NextButton disabled={!canSubmit || isSubmitting || isPending} />
            )}
          </Subscribe>
        </Actions>
      </ReactErrorBoundary>
    </FormDialog>
  );
};
