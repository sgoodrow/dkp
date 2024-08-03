import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { startCase } from "lodash";
import { AssignTransactionItemIconButton } from "@/ui/transactions/buttons/AssignTransactionItemIconButton";
import { app } from "@/shared/constants/app";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

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
          <Box overflow="auto">
            {data.item === null ? (
              <Typography color="warning.main">
                {app.copy.notRecognized}
              </Typography>
            ) : (
              <ItemLink item={data.item} itemName={data.itemName} />
            )}
            <Tooltip
              title="The name of the item that was uploaded."
              placement="left"
              disableInteractive
            >
              <OverflowTooltipTypography variant="body2" color="text.secondary">
                {startCase(data.itemName)}
              </OverflowTooltipTypography>
            </Tooltip>
          </Box>
        </Stack>
      )}
    </CellLayout>
  );
};
