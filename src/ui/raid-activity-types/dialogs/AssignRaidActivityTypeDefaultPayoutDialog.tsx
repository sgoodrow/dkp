"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { TextField } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

export const AssignRaidActivityTypeDefaultPayoutDialog: FC<{
  raidActivityTypeId: number;
  defaultPayout: number;
  onAssign: () => void;
  onClose: () => void;
}> = ({ raidActivityTypeId, defaultPayout, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      defaultPayout,
    },
    onSubmit: async ({ value }) => {
      mutate({
        id: raidActivityTypeId,
        defaultPayout: value.defaultPayout,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.raidActivity.updateType.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.raidActivity.invalidate();
      onAssign();
    },
  });

  return (
    <FormDialog
      id="assign-raid-activity-type-default-payout-dialog-title"
      title="Assign Raid Activity Default Payout Name"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field
        name="defaultPayout"
        validators={{
          onChange: ({ value }) => {
            if (value < 0) {
              return "Default payout must be greater than or equal to 0";
            }
            return;
          },
        }}
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <TextField
            placeholder={String(defaultPayout)}
            required
            label="Default Payout"
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
                : "Enter a non-negative default payout for the raid activity type"
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
