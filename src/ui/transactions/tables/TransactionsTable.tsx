"use client";

import { FC, useCallback, useMemo, useState } from "react";
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
import { WalletTransactionType } from "@prisma/client";
import { Unstable_Grid2 } from "@mui/material";
import { SwitchCard } from "@/ui/shared/components/cards/SwitchCard";

export type TransactionRow =
  TrpcRouteOutputs["wallet"]["getManyTransactions"]["rows"][number];

export const TransactionsTable: FC<{}> = ({}) => {
  const [showRejected, setShowRejected] = useState(false);
  const [showCleared, setShowCleared] = useState(false);

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
        headerName: "Cleared",
        field: "id",
        width: 100,
        cellRenderer: (props) => <ClearedCell {...props} />,
      },
      {
        headerName: "Date",
        field: "createdAt",
        width: 150,
        sortable: true,
        filter: "agDateColumnFilter",
        cellRenderer: (props) => <DateCell {...props} />,
      },
      {
        headerName: "Context",
        field: "raidActivity.type.name",
        flex: 1,
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
        cellRenderer: (props) => (
          <AmountCell
            {...props}
            onAssign={() => props.api.refreshInfiniteCache()}
          />
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
        editable: (props) =>
          props.data?.type === WalletTransactionType.PURCHASE,
        cellEditor: (props) =>
          props.data.type === WalletTransactionType.PURCHASE ? (
            <AssignTransactionItemDialog
              transactionId={props.data.id}
              item={props.data.item}
              onAssign={() => handleCellEdited(props)}
              onClose={() => handleCellEditorClosed(props)}
            />
          ) : (
            <></>
          ),
        cellRenderer: (props) => (
          <ItemCell
            {...props}
            onAssign={() => props.api.refreshInfiniteCache()}
          />
        ),
      },
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
    ],
    [],
  );

  // TODO: add a reject all button:
  // opens a dialog
  // requires a date field - applies to all before date
  // has a switch for including purchases, default to false
  // rejects all

  return (
    <InfiniteTable rowHeight={64} getRows={getRows} columnDefs={columnDefs}>
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
        <SwitchCard
          label="Show rejected"
          description="Rejected transactions do not affect any player's wallet."
          checked={showRejected}
          onClick={(newValue) => setShowRejected(newValue)}
        />
      </Unstable_Grid2>
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
        <SwitchCard
          label="Show cleared"
          description="Cleared transactions are applied to a player's wallet."
          checked={showCleared}
          onClick={(newValue) => setShowCleared(newValue)}
        />
      </Unstable_Grid2>
    </InfiniteTable>
  );
};
