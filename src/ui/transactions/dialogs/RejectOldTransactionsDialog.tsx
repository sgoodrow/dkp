"use client";

import {
  FormDialog,
  FormDialogButton,
} from "@/ui/shared/components/dialogs/FormDialog";
import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { trpc } from "@/api/views/trpc/trpc";
import { useGridApi } from "@/ui/shared/components/tables/InfiniteTable";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { LabeledSwitch } from "@/ui/shared/components/switches/LabeledSwitch";

const defaultValues = {
  before: dayjs(),
  includePurchases: false,
  includeAdjustments: false,
  onlyBots: false,
};

export const RejectOldTransactionsDialog: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const api = useGridApi();
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      mutate({
        before: value.before.toDate(),
        includePurchases: value.includePurchases,
        includeAdjustments: value.includeAdjustments,
        onlyBots: value.onlyBots,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.wallet.rejectManyUnclearedTransactions.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      api.refreshInfiniteCache();
      utils.wallet.invalidate();
    },
  });

  return (
    <FormDialog
      id="reject-old-transactions-dialog-title"
      title="Reject Old Transactions"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field name="before">
        {(field) => (
          <DateTimePicker
            defaultValue={field.state.value}
            label="Before"
            autoFocus
            onChange={(value) =>
              value !== null ? field.handleChange(value) : null
            }
            slotProps={{
              textField: {
                required: true,
              },
            }}
            disableFuture
          />
        )}
      </Field>
      <Field name="includePurchases">
        {(field) => (
          <LabeledSwitch
            switched={field.state.value}
            onChange={field.handleChange}
            label="Include purchases"
            helperText="Include uncleared purchase transactions as well."
          />
        )}
      </Field>
      <Field name="includeAdjustments">
        {(field) => (
          <LabeledSwitch
            switched={field.state.value}
            onChange={field.handleChange}
            label="Include adjustments"
            helperText="Include uncleared adjustment transactions as well."
          />
        )}
      </Field>
      <Field name="onlyBots">
        {(field) => (
          <LabeledSwitch
            switched={field.state.value}
            onChange={field.handleChange}
            label="Bots only"
            helperText="Only reject transactions from bots."
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
          <FormDialogButton
            label="Reject Old"
            disabled={!canSubmit || isSubmitting}
          />
        )}
      </Subscribe>
    </FormDialog>
  );
};
