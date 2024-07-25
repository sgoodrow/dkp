"use client";

import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { InfiniteTable } from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { Cell } from "@/ui/shared/components/table/Cell";

export const AdminsTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  return (
    <InfiniteTable
      getRows={utils.user.getAdmins.fetch}
      columnDefs={[
        {
          headerName: "Name",
          field: "displayName",
          flex: 1,
          filter: "agTextColumnFilter",
          cellRenderer: (props: ICellRendererParams) => (
            <Cell isLoading={props.data === undefined}>
              <SiteLink
                data-monitoring-id={monitoringIds.GOTO_RAID}
                label={props.value}
                href={uiRoutes.raid.href(props.data?.id)}
              />
            </Cell>
          ),
        },
      ]}
    />
  );
};
