"use client";

import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { InfiniteTable } from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { Cell } from "@/ui/shared/components/table/Cell";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const AdminsTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  return (
    <InfiniteTable
      getRows={utils.user.getAdmins.fetch}
      columnDefs={[
        {
          headerName: "Name",
          field: "displayName",
          minWidth: 100,
          flex: 1,
          cellRenderer: (props: ICellRendererParams) => (
            <Cell isLoading={props.data === undefined}>
              <PlayerLink
                user={{
                  id: props.data?.id,
                  displayName: props.data?.displayName,
                  discordMetadata: props.data?.discordMetadata,
                }}
              />
            </Cell>
          ),
        },
        {
          headerName: "Cleared Transactions",
          field: "_count.clearedTransactions",
          flex: 1,
          minWidth: 100,
        },
        {
          headerName: "Last Active",
          valueGetter: (params) => {
            return params.data?.clearedTransactions?.[0]?.updatedAt || "Never";
          },
          flex: 1,
          minWidth: 100,
        },
      ]}
    />
  );
};
