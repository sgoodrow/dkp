"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { UserAutocomplete } from "@/ui/transactions/inputs/UserAutocomplete";
import { DialogContentText } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

export const AssignTransactionPilotDialog: FC<{
  transactionId: number;
  pilot: {
    id: string;
    displayName: string;
    discordMetadata: {
      roleIds: string[];
    } | null;
  } | null;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, pilot, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      pilotId: pilot?.id || "",
    },
    onSubmit: async ({ value }) => {
      mutate({
        pilotId: value.pilotId,
        transactionId: transactionId,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.wallet.updateTransaction.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.invalidate();
      onAssign();
    },
  });

  return (
    <FormDialog
      id="assign-transaction-pilot-dialog-title"
      title={`${pilot ? "Re-" : ""}Assign Transaction Pilot`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {pilot && (
        <DialogContentText>
          Are you sure you want to re-assign the pilot for this transaction?
          <br />
          <br />
          It is currently assigned to <PlayerLink user={pilot} />.
        </DialogContentText>
      )}
      <Field name="pilotId">
        {(field) => (
          <UserAutocomplete
            label="Pilot"
            onChange={field.setValue}
            defaultValue={
              pilot ? { id: pilot.id, label: pilot.displayName } : undefined
            }
          />
        )}
      </Field>
      <Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <AssignDialogButton disabled={!canSubmit || isSubmitting} />
        )}
      </Subscribe>
    </FormDialog>
  );
};
