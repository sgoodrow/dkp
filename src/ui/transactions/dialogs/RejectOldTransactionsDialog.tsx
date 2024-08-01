"use client";

import {
  FormDialog,
  FormDialogButton,
} from "@/ui/shared/components/dialogs/FormDialog";
import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { trpc } from "@/api/views/trpc/trpc";
import { useGridApi } from "@/ui/shared/components/table/InfiniteTable";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Box, FormControlLabel, FormHelperText, Switch } from "@mui/material";

export const RejectOldTransactionsDialog: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const api = useGridApi();
  const { Field, Subscribe, handleSubmit, reset } = useForm<{
    before: Dayjs;
    includePurchases: boolean;
    includeAdjustments: boolean;
  }>({
    defaultValues: {
      before: dayjs(),
      includePurchases: false,
      includeAdjustments: false,
    },
    onSubmit: async ({ value }) => {
      mutate({
        before: value.before.toDate(),
        includePurchases: value.includePurchases,
        includeAdjustments: value.includeAdjustments,
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
      <Field
        name="before"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
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
      />
      <Field
        name="includePurchases"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <Box>
            <FormControlLabel
              sx={{
                ml: 0,
                width: "100%",
              }}
              control={
                <Switch
                  autoFocus
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              }
              label="Include purchases"
            />
            <FormHelperText>
              Include uncleared purchase transactions as well.
            </FormHelperText>
          </Box>
        )}
      />
      <Field
        name="includeAdjustments"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <Box>
            <FormControlLabel
              sx={{
                ml: 0,
                width: "100%",
              }}
              control={
                <Switch
                  autoFocus
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
              }
              label="Include adjustments"
            />
            <FormHelperText>
              Include uncleared adjustment transactions as well.
            </FormHelperText>
          </Box>
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
          <FormDialogButton
            label="Reject Old"
            disabled={!canSubmit || isSubmitting}
          />
        )}
      />
    </FormDialog>
  );
};
