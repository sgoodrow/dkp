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
      >
        {(field) => (
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
            onChange={(e) => field.handleChange(Number(e.target.value))}
            {...getHelperText({
              field,
              helperText:
                "Enter a non-negative default payout for the raid activity type",
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
