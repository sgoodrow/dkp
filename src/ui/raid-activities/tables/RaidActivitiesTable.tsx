"use client";

import { FC } from "react";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { getRaidActivityCreatedAtColumn } from "@/ui/raid-activities/tables/getRaidActivityCreatedAtColumn";
import { getRaidActivityNameColumn } from "@/ui/raid-activities/tables/getRaidActivityNameColumn";
import { getRaidActivityAttendeesColumn } from "@/ui/raid-activities/tables/getRaidActivityAttendeesColumn";

export type RaidActivityRow =
  TrpcRouteOutputs["raidActivity"]["getMany"]["rows"][number];

export const RaidActivitiesTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.raidActivity.getMany.fetch}
      columnDefs={[
        getRaidActivityCreatedAtColumn(),
        getRaidActivityNameColumn(),
        getRaidActivityAttendeesColumn(),
      ]}
    />
  );
};
