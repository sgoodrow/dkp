import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { Tooltip } from "@mui/material";
import { Block, CheckCircleOutline } from "@mui/icons-material";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { RequirementTooltip } from "@/ui/shared/components/tooltips/RequirementTooltip";

export const ClearedCell: FC<ICellRendererParams<TransactionRow>> = ({
  data,
}) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout alignItems="center">
      {data.rejected ? (
        <Tooltip
          disableInteractive
          placement="left"
          title="Transaction was rejected."
        >
          <Block color="error" />
        </Tooltip>
      ) : (
        <Tooltip
          disableInteractive
          placement="left"
          title={
            <>
              <RequirementTooltip
                label="Pilot"
                satisfied={data.walletId !== null}
              />
              <RequirementTooltip
                label="Item"
                satisfied={data.itemName !== null && data.itemId !== null}
                hidden={data.itemName === null}
              />
              <RequirementTooltip
                label="Not rejected"
                satisfied={!data.rejected}
              />
            </>
          }
        >
          {data.walletId !== null &&
          (data.itemName === null || data.itemId != null) ? (
            <CheckCircleOutline color="success" />
          ) : (
            <CheckCircleOutline color="disabled" />
          )}
        </Tooltip>
      )}
    </CellLayout>
  );
};
