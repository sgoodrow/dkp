import { app } from "@/shared/constants/app";
import { ItemLink } from "@/ui/shared/components/links/ItemLink";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { AssignTransactionItemIconButton } from "@/ui/transactions/buttons/AssignTransactionItemIconButton";
import { AssignTransactionItemDialog } from "@/ui/transactions/dialogs/AssignTransactionItemDialog";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { WalletTransactionType } from "@prisma/client";
import { startCase } from "lodash";

export const getTransactionItemColumn = ({
  editable = false,
}: {
  editable?: boolean;
}): Column<TransactionRow> => ({
  headerName: "Item",
  field: "itemName",
  flex: 1,
  editable: (props) =>
    editable && props.data?.type === WalletTransactionType.PURCHASE,
  cellEditor: (props) => {
    return (
      <AssignTransactionItemDialog
        transactionId={props.data.id}
        item={props.data.item}
        onAssign={() => handleCellEdited(props)}
        onClose={() => handleCellEditorClosed(props)}
      />
    );
  },
  cellRenderer: ({ data, api }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        {data.itemName === null ? null : (
          <Stack direction="row" spacing={1}>
            {editable && (
              <AssignTransactionItemIconButton
                transactionId={data.id}
                item={data.item}
                onAssign={() => api.refreshInfiniteCache()}
              />
            )}
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
                <OverflowTooltipTypography
                  variant="body2"
                  color="text.secondary"
                >
                  {startCase(data.itemName)}
                </OverflowTooltipTypography>
              </Tooltip>
            </Box>
          </Stack>
        )}
      </CellLayout>
    );
  },
});
