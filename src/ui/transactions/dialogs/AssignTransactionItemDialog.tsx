"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignButton,
  AssignValueDialog,
} from "@/ui/shared/components/dialogs/AssignValueDialog";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { ItemAutocomplete } from "@/ui/transactions/inputs/ItemAutocomplete";
import { DialogContentText } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC } from "react";

export const AssignTransactionItemDialog: FC<{
  transactionId: number;
  item: {
    id: number;
    name: string;
  } | null;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, item, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      itemId: item?.id || -1,
    },
    onSubmit: async ({ value }) => {
      mutate({
        itemId: value.itemId,
        transactionId: transactionId,
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
    <AssignValueDialog
      id="assign-transaction-item-dialog-title"
      title={`${item ? "Re-" : ""}Assign Transaction Item`}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      {item && (
        <DialogContentText>
          Are you sure you want to re-assign the item for this transaction?
          <br />
          <br />
          It is currently assigned to <ItemLink itemName={item?.name} />.
        </DialogContentText>
      )}
      <Field
        name="itemId"
        // eslint-disable-next-line react/no-children-prop
        children={(field) => (
          <ItemAutocomplete
            label="Item"
            onChange={field.setValue}
            defaultValue={item ? { id: item.id, label: item.name } : undefined}
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
          <AssignButton disabled={!canSubmit || isSubmitting} />
        )}
      />
    </AssignValueDialog>
  );
};
