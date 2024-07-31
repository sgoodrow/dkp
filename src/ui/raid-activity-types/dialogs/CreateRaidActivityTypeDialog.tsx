"use client";

import {
  CreateDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { FC } from "react";
import { useForm } from "@tanstack/react-form";
import { trpc } from "@/api/views/trpc/trpc";
import { TextField } from "@mui/material";
import { useGridApi } from "@/ui/shared/components/table/InfiniteTable";

export const CreateRaidActivityTypeDialog: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const api = useGridApi();
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      defaultPayout: 0,
    },
    onSubmit: async ({ value }) => {
      mutate({
        name: value.name,
        defaultPayout: value.defaultPayout,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.raidActivity.createType.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      api.refreshInfiniteCache();
      utils.raidActivity.invalidate();
    },
  });

  return (
    <FormDialog
      id="create-raid-activity-type-dialog-title"
      title="Create Raid Activity Type"
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
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <TextField
            required
            label="Name"
            autoFocus
            fullWidth
            error={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            }
            onChange={(e) => field.handleChange(e.target.value)}
            helperText={
              field.state.meta.isTouched && field.state.meta.errors.length > 0
                ? field.state.meta.errors.join(",")
                : "Enter a unique name for the raid activity type"
            }
          />
        )}
      />
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
            required
            label="Default Payout"
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
          <CreateDialogButton disabled={!canSubmit || isSubmitting} />
        )}
      />
    </FormDialog>
  );
};
