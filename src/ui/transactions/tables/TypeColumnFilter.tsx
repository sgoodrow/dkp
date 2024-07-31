import { FC, useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { WalletTransactionType } from "@prisma/client";
import { TransactionTypeIcon } from "@/ui/transactions/tables/TypeCell";
import { CustomFilterProps } from "ag-grid-react";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { EnumFilter } from "@/api/shared/agGridUtils/filterTypes/enum";

export const TypeColumnFilter: FC<
  CustomFilterProps<TransactionRow, any, EnumFilter>
> = ({ model, onModelChange, api }) => {
  const previous = model?.filterType === "enum" ? model.filter : null;
  const [type, setType] = useState<string | null>(previous);

  return (
    <>
      <Box className="ag-simple-filter-body-wrapper" textAlign="center">
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={(_, newValue) => setType(newValue)}
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
      <div className="ag-filter-apply-panel">
        <button
          type="submit"
          className="ag-standard-button ag-filter-apply-panel-button"
          onClick={() => {
            onModelChange(
              type === null
                ? null
                : {
                    filterType: "enum",
                    type: "equals",
                    filter: type,
                  },
            );
            api.hidePopupMenu();
          }}
        >
          Apply
        </button>
        <button
          type="button"
          className="ag-standard-button ag-filter-apply-panel-button"
          onClick={() => {
            onModelChange(null);
            setType(null);
            api.hidePopupMenu();
          }}
        >
          Reset
        </button>
        <button
          type="button"
          className="ag-standard-button ag-filter-apply-panel-button"
          onClick={() => {
            api.hidePopupMenu();
          }}
        >
          Cancel
        </button>
      </div>
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
