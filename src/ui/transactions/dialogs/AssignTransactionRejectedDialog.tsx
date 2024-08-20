"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { LabeledSwitch } from "@/ui/shared/components/switches/LabeledSwitch";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

export const AssignTransactionRejectedDialog: FC<{
  transactionId: number;
  rejected: boolean;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, rejected, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      rejected,
    },
    onSubmit: async ({ value }) => {
      mutate({
        transactionId,
        rejected: value.rejected,
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
      id="assign-transaction-rejected-dialog-title"
      title="Toggle Transaction Rejected"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field name="rejected">
        {(field) => (
          <LabeledSwitch
            switched={rejected}
            label="Rejected"
            onChange={(switched) => field.handleChange(switched)}
            helperText="Rejected transactions do not affect any player's wallet."
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
