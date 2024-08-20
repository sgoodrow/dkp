"use client";

import { FC } from "react";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { getUserNameColumn } from "@/ui/players/tables/getUserNameColumn";
import { getUserAccountStatusColumn } from "@/ui/players/tables/getUserAccountStatusColumn";
import { getUserDkpColumn } from "@/ui/players/tables/getUserDkpColumn";
import { getUserCharactersColumn } from "@/ui/players/tables/getUserCharactersColumn";

export type UserRow = TrpcRouteOutputs["user"]["getMany"]["rows"][number];

export const PlayersTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.user.getMany.fetch}
      columnDefs={[
        getUserNameColumn(),
        getUserAccountStatusColumn(),
        getUserDkpColumn(),
        getUserCharactersColumn(),
        getUserDkpColumn(),
      ]}
    />
  );
};
