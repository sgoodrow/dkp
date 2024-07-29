"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { ItemAutocomplete } from "@/ui/transactions/inputs/ItemAutocomplete";
import { Edit, Warning } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { FC, useState } from "react";

const DIALOG_TITLE_ID = "assign-item-dialog-title";

export const AssignItemIconButtonDialog: FC<{
  transactionId: number;
  item: {
    id: number;
    name: string;
  } | null;
  onAssign: () => void;
}> = ({ transactionId, item, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title={
          item
            ? "Click to change the item for this transaction"
            : "Click to assign an item to this transaction."
        }
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          {item ? <Edit /> : <Warning color="warning" />}
        </IconButton>
      </Tooltip>
      {open && (
        <AssignItemDialog
          transactionId={transactionId}
          item={item}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

const AssignItemDialog: FC<{
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

  const { mutate } = trpc.wallet.assignTransactionItem.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.invalidate();
      onAssign();
    },
  });

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby={DIALOG_TITLE_ID}
      fullWidth
      disableRestoreFocus
      maxWidth="sm"
    >
      <DialogTitle id={DIALOG_TITLE_ID}>
        {item ? "Re-" : ""}Assign Transaction Item
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          display="flex"
          direction="column"
          spacing={2}
          mt={1}
        >
          {item && (
            <DialogContentText>
              Are you sure you want to re-assign the item for this transaction?
              <br />
              <br />
              It is currently assigned to <ItemLink itemName={item?.name} />.
            </DialogContentText>
          )}
          {
            <Field
              name="itemId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <ItemAutocomplete
                  label="Item"
                  onChange={field.setValue}
                  defaultValue={
                    item ? { id: item.id, label: item.name } : undefined
                  }
                />
              )}
            />
          }
          <Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            // eslint-disable-next-line react/no-children-prop
            children={({ canSubmit, isSubmitting }) => {
              return (
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={!canSubmit || isSubmitting}
                  fullWidth
                >
                  Assign
                </Button>
              );
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
