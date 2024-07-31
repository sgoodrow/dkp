"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignButton,
  AssignValueDialog,
} from "@/ui/shared/components/dialogs/AssignValueDialog";
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

  const { mutate } = trpc.wallet.assignTransactionPilot.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.invalidate();
      onAssign();
    },
  });

  return (
    <AssignValueDialog
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
      <Field
        name="pilotId"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <UserAutocomplete
            label="Pilot"
            onChange={field.setValue}
            defaultValue={
              pilot ? { id: pilot.id, label: pilot.displayName } : undefined
            }
          />
        )}
      />
      <Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
        // eslint-disable-next-line react/no-children-prop
        children={({ canSubmit, isSubmitting }) => (
          <AssignButton disabled={!canSubmit || isSubmitting} />
        )}
      />
    </AssignValueDialog>
  );
};
