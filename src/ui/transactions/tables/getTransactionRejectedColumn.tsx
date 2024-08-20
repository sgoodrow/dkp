"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { BooleanColumnFilter } from "@/ui/shared/components/tables/BooleanColumnFilter";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { AssignTransactionRejectedDialog } from "@/ui/transactions/dialogs/AssignTransactionRejectedDialog";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { Checkbox, Tooltip } from "@mui/material";

export const getTransactionRejectedColumn = ({
  editable = false,
}: {
  editable?: boolean;
}): Column<TransactionRow> => ({
  hide: !editable,
  headerName: "Rejected",
  field: "rejected",
  width: 140,
  sortable: true,
  filter: BooleanColumnFilter,
  editable,
  cellEditor: (props) => {
    return (
      <AssignTransactionRejectedDialog
        transactionId={props.data.id}
        rejected={props.data.rejected}
        onAssign={() => handleCellEdited(props)}
        onClose={() => handleCellEditorClosed(props)}
      />
    );
  },
  cellRenderer: ({ data, api }) => {
    const utils = trpc.useUtils();
    const { mutate } = trpc.wallet.updateTransaction.useMutation({
      onSuccess: () => {
        utils.wallet.invalidate();
        api.refreshInfiniteCache();
      },
    });

    return data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout alignItems="center">
        <Tooltip
          disableInteractive
          placement="left"
          title={
            data.rejected
              ? `Recover transaction ${data.id}.`
              : `Reject transaction ${data.id}.`
          }
        >
          <Checkbox
            size="small"
            checked={data.rejected}
            onClick={() =>
              mutate({
                transactionId: data.id,
                rejected: !data.rejected,
              })
            }
          />
        </Tooltip>
      </CellLayout>
    );
  },
});
