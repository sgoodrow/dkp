"use client";

import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC, useDeferredValue, useState } from "react";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { TypographyCell } from "@/ui/shared/components/table/TypographyCell";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { lowerCase, startCase } from "lodash";
import { Warning } from "@mui/icons-material";
import { useForm } from "@tanstack/react-form";
import { useDebounceValue } from "usehooks-ts";

const DIALOG_TITLE_ID = "assign-item-id-dialog-title";

export const ItemCell: FC<ICellRendererParams<TransactionRow>> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const isDisconnected = data?.itemName !== null && data?.itemId === null;

  // Whats this assignment mean in the db? do we need to "fix" a db item name? It depends, sometimes
  // the import name might be wrong (ninja looter csv tampering) and the name needs to be fixed.
  // Other times the name might be right and our internal name is wrong and needs to be fixed.
  return data === undefined ? (
    <LoadingCell />
  ) : data.itemName === null ? (
    <TypographyCell color="text.secondary"></TypographyCell>
  ) : (
    <CellLayout>
      {isDisconnected ? (
        <>
          <Button
            startIcon={<Warning color="warning" />}
            variant="text"
            fullWidth
            color="warning"
            onClick={() => setOpen(true)}
            sx={{
              display: "flex",
            }}
          >
            <Typography fontSize="inherit" noWrap>
              {data.itemName}
            </Typography>
          </Button>
          {open && (
            <ItemCellDialog
              itemName={data.itemName}
              itemId={data.itemId}
              onClose={() => setOpen(false)}
            />
          )}
        </>
      ) : (
        <ItemLink itemName={data.itemName} />
      )}
    </CellLayout>
  );
};

const ItemCellDialog: FC<{
  itemName: string;
  itemId: number | null;
  onClose: () => void;
}> = ({ itemName, itemId, onClose }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 300);

  const { Field, Subscribe, handleSubmit, reset, useStore } = useForm({
    defaultValues: {
      itemId: -1,
    },
    onSubmit: async ({ value }) => {
      // mutate({
      //   itemId: value.itemId,
      // });
    },
  });

  const currentItemId = useStore((state) => state.values.itemId);

  const { data: items, isLoading: isLoadingItems } =
    trpc.item.getByNameIncludes.useQuery({
      search: debouncedSearch,
      take: 10,
    });

  const utils = trpc.useUtils();

  // TODO: replace this with item upsert
  const { mutate } = trpc.character.create.useMutation({
    onSuccess: () => {
      reset();
      onClose();
      utils.wallet.getManyTransactions.invalidate();
    },
  });

  const itemNameOption = { id: -1, name: itemName };

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby={DIALOG_TITLE_ID}
      fullWidth
      disableRestoreFocus
      maxWidth="sm"
    >
      <DialogTitle id={DIALOG_TITLE_ID}>Fix Item Association</DialogTitle>
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
          <DialogContentText>
            This item record was not recognized. Select the correct item below
            to fix the transaction&apos;s item ID.
            <br />
            <br />
            <strong>Unrecognized name:</strong> "{itemName}"
          </DialogContentText>
          {
            <Field
              name="itemId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <Autocomplete
                  filterOptions={(x) => x}
                  value={
                    items?.find(({ id }) => id === itemId) || itemNameOption
                  }
                  inputValue={search}
                  onInputChange={(e, newValue) => {
                    setSearch(newValue);
                  }}
                  onChange={(e, newValue) => {
                    e.stopPropagation();
                    field.handleChange(newValue?.id || -1);
                  }}
                  options={
                    items ? [...items, itemNameOption] : [itemNameOption]
                  }
                  loading={isLoadingItems}
                  disableClearable
                  autoHighlight
                  autoSelect
                  getOptionLabel={({ name }) => startCase(lowerCase(name))}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField {...params} required autoFocus label="Item" />
                  )}
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
                  Fix
                </Button>
              );
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
