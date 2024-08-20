"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { getHelperText } from "@/ui/shared/utils/formHelpers";
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
      >
        {(field) => (
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
            onChange={(e) => field.handleChange(Number(e.target.value))}
            {...getHelperText({
              field,
              helperText: "Enter a non-negative amount for the transaction",
            })}
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
