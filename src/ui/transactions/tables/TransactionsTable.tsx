"use client";

import { FC, useCallback, useMemo } from "react";
import {
  Column,
  GetRows,
  handleCellEdited,
  handleCellEditorClosed,
  InfiniteTable,
} from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { ItemCell } from "@/ui/transactions/tables/ItemCell";
import { TypographyCell } from "@/ui/shared/components/table/TypographyCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { ClearedCell } from "@/ui/transactions/tables/ClearedCell";
import { RejectedCell } from "@/ui/transactions/tables/RejectedCell";
import { AmountCell } from "@/ui/transactions/tables/AmountCell";
import { PilotCell } from "@/ui/transactions/tables/PilotCell";
import { TypeColumnFilter } from "@/ui/transactions/tables/TypeColumnFilter";
import { DateCell } from "@/ui/transactions/tables/DateCell";
import { AssignTransactionRejectedDialog } from "@/ui/transactions/dialogs/AssignTransactionRejectedDialog";
import { AssignTransactionPilotDialog } from "@/ui/transactions/dialogs/AssignTransactionPilotDialog";
import { AssignTransactionItemDialog } from "@/ui/transactions/dialogs/AssignTransactionItemDialog";
import { AssignTransactionAmountDialog } from "@/ui/transactions/dialogs/AssignTransactionAmountDialog";

export type TransactionRow =
  TrpcRouteOutputs["wallet"]["getManyTransactions"]["rows"][number];

export const TransactionsTable: FC<{
  showRejected: boolean;
  showCleared: boolean;
}> = ({ showRejected, showCleared }) => {
  const utils = trpc.useUtils();

  const getRows: GetRows<TransactionRow> = useCallback(
    (params) =>
      utils.wallet.getManyTransactions.fetch({
        showRejected: showRejected,
        showCleared,
        ...params,
      }),
    [utils, showRejected, showCleared],
  );

  const columnDefs = useMemo<Column<TransactionRow>[]>(
    () => [
      {
        headerName: "Rejected",
        field: "rejected",
        width: 100,
        sortable: true,
        editable: true,
        cellEditor: (props) => (
          <AssignTransactionRejectedDialog
            transactionId={props.data.id}
            rejected={props.data.rejected}
            onAssign={() => handleCellEdited(props)}
            onClose={() => handleCellEditorClosed(props)}
          />
        ),
        cellRenderer: (props) => (
          <RejectedCell
            {...props}
            onToggle={() => props.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Date",
        field: "createdAt",
        width: 150,
        sortable: true,
        filter: "agDateColumnFilter",
        suppressNavigable: true,
        cellRenderer: (props) => <DateCell {...props} />,
      },
      {
        headerName: "Amount",
        field: "type",
        width: 150,
        filter: TypeColumnFilter,
        editable: true,
        cellEditor: (props) => (
          <AssignTransactionAmountDialog
            transactionId={props.data.id}
            amount={props.data.amount}
            onAssign={() => handleCellEdited(props)}
            onClose={() => handleCellEditorClosed(props)}
          />
        ),
        cellRenderer: (props) => <AmountCell {...props} />,
      },
      {
        headerName: "Context",
        field: "raidActivity.type.name",
        flex: 1,
        suppressNavigable: true,
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : props.data.raidActivity === null ? (
            <TypographyCell color="text.secondary">Unknown</TypographyCell>
          ) : (
            <CellLayout>
              <OverflowTooltipTypography>
                {props.data.raidActivity.type.name}
              </OverflowTooltipTypography>
              <OverflowTooltipTypography variant="body2" color="text.secondary">
                {props.data.reason}
              </OverflowTooltipTypography>
            </CellLayout>
          ),
      },
      {
        headerName: "Pilot",
        field: "characterName",
        flex: 1,
        editable: true,
        cellEditor: (props) => (
          <AssignTransactionPilotDialog
            transactionId={props.data.id}
            pilot={props.data.wallet?.user || null}
            onAssign={() => handleCellEdited(props)}
            onClose={() => handleCellEditorClosed(props)}
          />
        ),
        cellRenderer: (props) => (
          <PilotCell
            {...props}
            onAssign={() => props.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Item",
        field: "itemName",
        flex: 1,
        editable: true,
        cellEditor: (props) => (
          <AssignTransactionItemDialog
            transactionId={props.data.id}
            item={props.data.item}
            onAssign={() => handleCellEdited(props)}
            onClose={() => handleCellEditorClosed(props)}
          />
        ),
        cellRenderer: (props) => (
          <ItemCell
            {...props}
            onAssign={() => props.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Cleared",
        field: "id",
        width: 100,
        suppressNavigable: true,
        cellRenderer: (props) => <ClearedCell {...props} />,
      },
    ],
    [],
  );

  return (
    <InfiniteTable rowHeight={64} getRows={getRows} columnDefs={columnDefs} />
  );
};
