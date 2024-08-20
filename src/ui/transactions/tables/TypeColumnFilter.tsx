import { FC, useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { WalletTransactionType } from "@prisma/client";
import { TransactionTypeIcon } from "@/ui/transactions/icons/TransactionTypeIcon";
import { CustomFilterProps } from "ag-grid-react";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { EnumFilter } from "@/api/shared/agGridUtils/filterTypes/enum";
import { FilterChangeButtons } from "@/ui/shared/components/tables/FilterChangeButtons";

export const TypeColumnFilter: FC<
  CustomFilterProps<TransactionRow, any, EnumFilter>
> = ({ model, onModelChange, api }) => {
  const value = model?.filterType === "enum" ? model.filter : null;

  const handleModelChange = (newValue: WalletTransactionType | null) => {
    onModelChange(
      newValue === null
        ? null
        : {
            filterType: "enum",
            type: "equals",
            filter: newValue,
          },
    );
  };

  return (
    <>
      <Box className="ag-simple-filter-body-wrapper" textAlign="center">
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={(_, newValue) => handleModelChange(newValue)}
          aria-label="Transaction type filter"
          size="small"
          sx={{
            bgcolor: "var(--ag-background-color)",
          }}
        >
          <TypeToggleButton
            value={WalletTransactionType.PURCHASE}
            label="Show purchase transactions only"
          />
          <TypeToggleButton
            value={WalletTransactionType.ADJUSTMENT}
            label="Show adjustment transactions only"
          />
          <TypeToggleButton
            value={WalletTransactionType.ATTENDANCE}
            label="Show attendance transactions only"
          />
        </ToggleButtonGroup>
      </Box>
      <FilterChangeButtons
        onClear={() => {
          onModelChange(null);
          api.hidePopupMenu();
        }}
        onCancel={() => {
          api.hidePopupMenu();
        }}
      />
    </>
  );
};

const TypeToggleButton: FC<{ value: WalletTransactionType; label: string }> = ({
  value,
  label,
}) => {
  return (
    <ToggleButton
      sx={{
        color: "var(--ag-alpine-active-color)",
        borderColor: "var(--ag-alpine-active-color)",
        padding: 1,
      }}
      value={value}
      aria-label={label}
    >
      <TransactionTypeIcon type={value} height="1rem" />
    </ToggleButton>
  );
};
