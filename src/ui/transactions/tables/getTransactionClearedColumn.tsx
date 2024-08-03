import { transaction } from "@/shared/utils/transaction";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { RequirementTooltip } from "@/ui/shared/components/tooltips/RequirementTooltip";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { Block, CheckCircleOutline } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const getTransactionClearedColumn = (): Column<TransactionRow> => ({
  headerName: "Cleared",
  field: "id",
  width: 100,
  cellRenderer: ({ data }) => {
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
                  label="Charater"
                  satisfied={data.characterId !== null}
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
            {transaction.isCleared(data) ? (
              <CheckCircleOutline color="success" />
            ) : (
              <CheckCircleOutline color="disabled" />
            )}
          </Tooltip>
        )}
      </CellLayout>
    );
  },
});
