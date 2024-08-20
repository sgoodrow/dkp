"use client";

import {
  FormDialog,
  FormDialogButton,
} from "@/ui/shared/components/dialogs/FormDialog";
import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { trpc } from "@/api/views/trpc/trpc";
import { useGridApi } from "@/ui/shared/components/tables/InfiniteTable";
import { TextField } from "@mui/material";
import { getHelperText } from "@/ui/shared/utils/formHelpers";

export const SetRaidActivityAttendanceAmountDialog: FC<{
  id: number;
  amount: number;
  onClose: () => void;
}> = ({ id, amount, onClose }) => {
  const api = useGridApi();
  const { Field, Subscribe, handleSubmit, reset } = useForm<{
    amount: number;
  }>({
    defaultValues: {
      amount,
    },
    onSubmit: async ({ value }) => {
      mutate({
        raidActivityId: id,
        amount: value.amount,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.wallet.setRaidActivityAttendanceAmount.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      api.refreshInfiniteCache();
      utils.wallet.invalidate();
    },
  });

  return (
    <FormDialog
      id="set-raid-activity-attendance-amount-dialog-title"
      title="Set Raid Activity Attendance Amount"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field name="amount">
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
          <FormDialogButton label="Set" disabled={!canSubmit || isSubmitting} />
        )}
      </Subscribe>
    </FormDialog>
  );
};
