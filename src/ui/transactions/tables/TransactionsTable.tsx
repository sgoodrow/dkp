"use client";

import { FC, useCallback, useMemo } from "react";
import {
  ColDef,
  GetRows,
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

  const columnDefs: ColDef<TransactionRow>[] = useMemo(
    () => [
      {
        headerName: "Rejected",
        field: "rejected",
        width: 100,
        sortable: true,
        cellRenderer: (params) => (
          <RejectedCell
            {...params}
            onToggle={() => params.api.refreshInfiniteCache()}
          />
        ),
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
        headerName: "Amount",
        field: "type",
        width: 150,
        filter: TypeColumnFilter,
        cellRenderer: (params) => <AmountCell {...params} />,
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
        headerName: "Pilot",
        field: "characterName",
        flex: 1,
        cellRenderer: (params) => (
          <PilotCell
            {...params}
            onAssign={() => params.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Item",
        field: "itemName",
        flex: 1,
        cellRenderer: (params) => (
          <ItemCell
            {...params}
            onAssign={() => params.api.refreshInfiniteCache()}
          />
        ),
      },
      {
        headerName: "Cleared",
        field: "id",
        width: 100,
        cellRenderer: (params) => <ClearedCell {...params} />,
      },
    ],
    [],
  );

  return (
    <InfiniteTable rowHeight={64} getRows={getRows} columnDefs={columnDefs} />
  );
};
