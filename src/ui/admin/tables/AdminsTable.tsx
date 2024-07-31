"use client";

import { FC, useMemo } from "react";
import {
  Column,
  InfiniteTable,
} from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { DateCell } from "@/ui/transactions/tables/DateCell";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";

type Row = TrpcRouteOutputs["user"]["getAdmins"]["rows"][number];

export const AdminsTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const columnDef: Column<Row>[] = useMemo(
    () => [
      {
        headerName: "Name",
        field: "displayName",
        minWidth: 100,
        flex: 1,
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <PlayerLink
                user={{
                  id: props.data?.id,
                  displayName: props.data?.displayName,
                  discordMetadata: props.data?.discordMetadata,
                }}
              />
            </CellLayout>
          ),
      },
      {
        headerName: "Updated Transactions",
        field: "_count.updatedTransactions",
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "Last Active",
        valueGetter: (params) =>
          params.data?.updatedTransactions?.[0]?.updatedAt,
        cellRenderer: (props) => <DateCell {...props} />,
        flex: 1,
        minWidth: 100,
      },
    ],
    [],
  );

  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.user.getAdmins.fetch}
      columnDefs={columnDef}
    />
  );
};
