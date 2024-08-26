"use client";

import { FC } from "react";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { getRaidActivityCreatedAtColumn } from "@/ui/raid-activities/tables/getRaidActivityCreatedAtColumn";
import { getRaidActivityNoteColumn } from "@/ui/raid-activities/tables/getRaidActivityNoteColumn";
import { getRaidActivityAttendeesColumn } from "@/ui/raid-activities/tables/getRaidActivityAttendeesColumn";
import { getRaidActivityTypeColumn } from "@/ui/raid-activities/tables/getRaidActivityTypeColumn";

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
        getRaidActivityTypeColumn(),
        getRaidActivityNoteColumn(),
        getRaidActivityAttendeesColumn(),
      ]}
    />
  );
};
