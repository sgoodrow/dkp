"use client";

import { Checkbox } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { GridApi } from "ag-grid-community";
import {
  Column,
  GetRows,
  InfiniteTable,
} from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { TransactionTypeIcon } from "@/ui/transactions/icons/TransactionTypeIcon";
import { ItemCell } from "@/ui/transactions/tables/ItemCell";
import { TypographyCell } from "@/ui/shared/components/table/TypographyCell";

export type TransactionRow =
  TrpcRouteOutputs["wallet"]["getManyTransactions"]["rows"][number];

export const TransactionsTable: FC<{
  showArchived: boolean;
  showCleared: boolean;
}> = ({ showArchived, showCleared }) => {
  const utils = trpc.useUtils();

  const [api, setApi] = useState<GridApi<TransactionRow> | null>(null);

  const getRows: GetRows<TransactionRow> = useCallback(
    (params) =>
      utils.wallet.getManyTransactions.fetch({
        showArchived,
        showCleared,
        ...params,
      }),
    [utils, showArchived, showCleared],
  );

  const { mutate: archiveTransaction } =
    trpc.wallet.archiveTransaction.useMutation({
      onSuccess: () => {
        utils.wallet.invalidate();
        api?.refreshInfiniteCache();
      },
    });

  const handleArchiveTransaction = useCallback(
    ({
      transactionId,
      archived,
    }: {
      transactionId?: number;
      archived?: boolean;
    }) => {
      if (transactionId === undefined || archived === undefined) {
        return;
      }
      archiveTransaction({
        transactionId,
        archived,
      });
    },
    [archiveTransaction],
  );

  const columnDefs: Column<TransactionRow>[] = useMemo(() => {
    return [
      {
        headerName: "Archived",
        field: "archived",
        width: 100,
        sortable: true,
        cellRenderer: (props) => (
          <Checkbox
            checked={props.data?.archived}
            onClick={() =>
              handleArchiveTransaction({
                transactionId: props.data?.id,
                archived: !props.data?.archived,
              })
            }
          />
        ),
      },
      {
        headerName: "ID",
        field: "id",
        width: 100,
        sortable: true,
      },
      {
        headerName: "Date",
        field: "createdAt",
        width: 120,
        sortable: true,
        filter: "agDateColumnFilter",
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <DateTypography date={props.value} />
            </CellLayout>
          ),
      },
      {
        headerName: "Type",
        field: "type",
        width: 80,
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <TransactionTypeIcon type={props.data.type} />
            </CellLayout>
          ),
      },
      {
        headerName: "Value",
        field: "amount",
        width: 80,
      },
      {
        headerName: "Character",
        field: "characterName",
        cellRenderer: (props) =>
          // TODO: this should show if the character is "known" or not (link vs not + icon); or a way to fix it if its not.
          // Probably an inline autocomplete to assign to a player.
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <CharacterLink
                characterName={
                  props.data.pilotCharacterName || props.data.characterName
                }
              />
            </CellLayout>
          ),
      },
      {
        headerName: "Item",
        field: "itemName",
        cellRenderer: (params) => <ItemCell {...params} />,
      },
      {
        headerName: "Pilot",
        field: "wallet.user.displayName",
        cellRenderer: (props) => {
          // TODO: this should show a remediation flow for assigning a pilot.
          return props.data === undefined ? (
            <LoadingCell />
          ) : props.data.wallet === null ? (
            <TypographyCell color="text.secondary">Unknown</TypographyCell>
          ) : (
            <CellLayout>
              <PlayerLink user={props.data.wallet.user} />
            </CellLayout>
          );
        },
      },
      {
        headerName: "Raid",
        field: "raidActivity.type.name",
      },
      {
        headerName: "Reason",
        field: "reason",
        flex: 1,
      },
    ];
  }, [handleArchiveTransaction]);

  return (
    <InfiniteTable
      getRows={getRows}
      columnDefs={columnDefs}
      onGridReady={(api) => setApi(api)}
    />
  );
};
