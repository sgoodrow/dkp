"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignButton,
  AssignValueDialog,
} from "@/ui/shared/components/dialogs/AssignValueDialog";
import { FormControlLabel, FormHelperText, Switch } from "@mui/material";
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
    <AssignValueDialog
      id="assign-transaction-rejected-dialog-title"
      title="Toggle Transaction Rejected"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field
        name="rejected"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <>
            <FormControlLabel
              sx={{
                ml: -1,
                width: "100%",
              }}
              control={
                <Switch
                  autoFocus
                  value={rejected}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              }
              label="Rejected"
            />
            <FormHelperText>
              Rejected transactions do not affect any player&apos;s wallet.
            </FormHelperText>
          </>
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
