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
      <Field
        name="amount"
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
      {/* Add switches for type inclusions, and some dialog content */}
      <Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
        // eslint-disable-next-line react/no-children-prop
        children={({ canSubmit, isSubmitting }) => (
          <FormDialogButton label="Set" disabled={!canSubmit || isSubmitting} />
        )}
      />
    </FormDialog>
  );
};
