"use client";

import { FC, useMemo } from "react";
import {
  Column,
  InfiniteTable,
} from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { Unstable_Grid2 } from "@mui/material";
import { CreateRaidActivityTypeCard } from "@/ui/raid-activity-types/cards/CreateRaidActivityTypeCard";
import { getRaidActivityTypeUpdatedAtColumn } from "@/ui/raid-activity-types/tables/getRaidActivityTypeUpdatedAtColumn";
import { getRaidActivityTypeUpdatedByColumn } from "@/ui/raid-activity-types/tables/getRaidActivityTypeUpdatedByColumn";
import { getRaidActivityTypeLatestRaidActivityColumn } from "@/ui/raid-activity-types/tables/getRaidActivityTypeLatestRaidActivityColumn";
import { getRaidActivityTypeDefaultPayoutColumn } from "@/ui/raid-activity-types/tables/getRaidActivityTypeDefaultPayoutColumn";
import { getRaidActivityTypeNameColumn } from "@/ui/raid-activity-types/tables/getRaidActivityTypeUpdatedAtColumn copy";

export type RaidActivityTypeRow =
  TrpcRouteOutputs["raidActivity"]["getManyTypes"]["rows"][number];

export const RaidActivityTypesTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const { data: isAdmin } = trpc.user.isAdmin.useQuery();
  const columnDefs = useMemo<Column<RaidActivityTypeRow>[]>(
    () => [
      getRaidActivityTypeNameColumn({ editable: isAdmin }),
      getRaidActivityTypeDefaultPayoutColumn({ editable: isAdmin }),
      getRaidActivityTypeUpdatedAtColumn(),
      getRaidActivityTypeUpdatedByColumn(),
      getRaidActivityTypeLatestRaidActivityColumn(),
    ],
    [isAdmin],
  );

  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.raidActivity.getManyTypes.fetch}
      columnDefs={columnDefs}
    >
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
        <CreateRaidActivityTypeCard />
      </Unstable_Grid2>
    </InfiniteTable>
  );
};
