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

export const AssignRaidActivityTypeNameDialog: FC<{
  raidActivityTypeId: number;
  name: string;
  onAssign: () => void;
  onClose: () => void;
}> = ({ raidActivityTypeId, name, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      name,
    },
    onSubmit: async ({ value }) => {
      mutate({
        id: raidActivityTypeId,
        name: value.name,
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
      id="assign-raid-activity-type-name-dialog-title"
      title="Assign Raid Activity Type Name"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Field
        name="name"
        validators={{
          onChangeAsyncDebounceMs: 300,
          onChangeAsync: async ({ value }) => {
            const isNameAvailable =
              await utils.raidActivity.isTypeNameAvailable.fetch({
                name: value,
              });
            if (!isNameAvailable) {
              return "Name already in use";
            }
          },
        }}
      >
        {(field) => (
          <TextField
            placeholder={name}
            required
            label="Name"
            autoFocus
            fullWidth
            onChange={(e) => field.handleChange(e.target.value)}
            {...getHelperText({
              field,
              helperText: "Enter a unique name for the raid activity type",
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
