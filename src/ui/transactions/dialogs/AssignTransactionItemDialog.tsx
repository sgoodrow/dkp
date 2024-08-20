"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  AssignDialogButton,
  FormDialog,
} from "@/ui/shared/components/dialogs/FormDialog";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { LabeledSwitch } from "@/ui/shared/components/switches/LabeledSwitch";
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
  itemName: string | null;
  onAssign: () => void;
  onClose: () => void;
}> = ({ transactionId, item, itemName, onAssign, onClose }) => {
  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      itemId: item?.id || -1,
      applyToAll: false,
    },
    onSubmit: async ({ value }) => {
      mutate({
        itemId: value.itemId,
        transactionId: transactionId,
        applyToAllUnassignedPurchases: value.applyToAll,
      });
    },
  });

  const utils = trpc.useUtils();

  const { mutate } = trpc.wallet.assignPurchaseItem.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.invalidate();
      onAssign();
    },
  });

  return (
    <FormDialog
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
          It is currently assigned to{" "}
          <ItemLink item={item} itemName={item.name} />.
        </DialogContentText>
      )}
      <Field name="itemId">
        {(field) => (
          <ItemAutocomplete
            label="Item"
            placeholder={item?.name || itemName || "Select an item..."}
            onChange={field.setValue}
            defaultValue={item ? { id: item.id, label: item.name } : undefined}
          />
        )}
      </Field>
      <Field name="applyToAll">
        {(field) => (
          <LabeledSwitch
            switched={field.state.value}
            onChange={field.setValue}
            label="Apply To All"
            helperText="If enabled, all purchases with the same name that do not have an item assignment will also be assigned to this item."
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
