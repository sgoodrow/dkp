import { transaction } from "@/shared/utils/transaction";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { RequirementTypography } from "@/ui/shared/components/typography/RequirementTypography";
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
                <RequirementTypography
                  label="Pilot"
                  satisfied={data.walletId !== null}
                />
                <RequirementTypography
                  label="Charater"
                  satisfied={data.characterId !== null}
                />
                <RequirementTypography
                  label="Item"
                  satisfied={data.itemName !== null && data.itemId !== null}
                  hidden={data.itemName === null}
                />
                <RequirementTypography
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
