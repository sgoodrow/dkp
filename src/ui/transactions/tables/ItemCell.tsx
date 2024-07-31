import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { startCase } from "lodash";
import { AssignTransactionItemIconButton } from "@/ui/transactions/buttons/AssignTransactionItemIconButton";

export const ItemCell: FC<
  ICellRendererParams<TransactionRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      {data.itemName === null ? null : (
        <Stack direction="row" spacing={1}>
          <AssignTransactionItemIconButton
            transactionId={data.id}
            item={data.item}
            onAssign={onAssign}
          />
          <Box>
            {data.item === null ? (
              <Typography color="warning.main">Item not recognized</Typography>
            ) : (
              <ItemLink itemName={data.item.name} />
            )}
            <Tooltip
              title="The name of the item that was uploaded."
              placement="left"
              disableInteractive
            >
              <Typography variant="body2" color="text.secondary">
                {startCase(data.itemName)}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>
      )}
    </CellLayout>
  );
};
