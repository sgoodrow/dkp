"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { TextField } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

export const AssignTransactionAmountDialog: FC<{
  transactionId: number;
  amount: number;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, amount, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      amount,
    },
    onSubmit: async ({ value }) => {
      mutate({
        transactionId,
        amount: value.amount,
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
      id="assign-transaction-amount-dialog-title"
      title="Change Transaction Amount"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field
        name="amount"
        validators={{
          onChange: ({ value }) => {
            if (value < 0) {
              return "Amount must be greater than or equal to 0";
            }
            return;
          },
        }}
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <TextField
            placeholder={String(amount)}
            required
            label="Amount"
            autoFocus
            fullWidth
            type="number"
            inputProps={{
              step: "any",
            }}
            error={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            }
            onChange={(e) => field.handleChange(Number(e.target.value))}
            helperText={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
                ? field.state.meta.errors.join(",")
                : "Enter a non-negative amount for the transaction"
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
          <AssignDialogButton disabled={!canSubmit || isSubmitting} />
        )}
      />
    </FormDialog>
  );
};
