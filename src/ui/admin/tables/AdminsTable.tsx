"use client";

import { FC } from "react";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { getAdminNameColumn } from "@/ui/admin/tables/getAdminNameColumn";
import { getAdminUpdatedTransactionsColumn } from "@/ui/admin/tables/getAdminUpdatedTransactionsColumn";
import { getAdminLastActiveColumn } from "@/ui/admin/tables/getAdminLastActiveColumn";

export type AdminRow =
  TrpcRouteOutputs["user"]["getManyAdmins"]["rows"][number];

export const AdminsTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.user.getManyAdmins.fetch}
      columnDefs={[
        getAdminNameColumn(),
        getAdminUpdatedTransactionsColumn(),
        getAdminLastActiveColumn(),
      ]}
    />
  );
};
