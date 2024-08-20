import { app } from "@/shared/constants/app";
import { item } from "@/shared/utils/item";
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
import { Box, Stack, Typography } from "@mui/material";
import { WalletTransactionType } from "@prisma/client";

export const getTransactionItemColumn = ({
  editable = false,
}: {
  editable?: boolean;
}): Column<TransactionRow> => ({
  headerName: "Item",
  field: "itemName",
  sortable: true,
  filter: "agTextColumnFilter",
  flex: 1,
  editable: (props) =>
    editable && props.data?.type === WalletTransactionType.PURCHASE,
  cellEditor: (props) => {
    return (
      <AssignTransactionItemDialog
        transactionId={props.data.id}
        item={props.data.item}
        itemName={props.data.itemName}
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
                itemName={data.itemName}
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
              <OverflowTooltipTypography
                variant="body2"
                color="text.secondary"
                tooltip="The name of the item that was uploaded."
                placement="left"
              >
                {item.normalizeName(data.itemName)}
              </OverflowTooltipTypography>
            </Box>
          </Stack>
        )}
      </CellLayout>
    );
  },
});
