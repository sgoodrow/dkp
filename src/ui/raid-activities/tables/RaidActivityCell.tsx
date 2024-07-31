import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { Typography } from "@mui/material";
import { RaidActivityType } from "@prisma/client";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";

export const RaidActivityCell: FC<{
  data?: {
    id: number;
    type: RaidActivityType;
    note: string | null;
  } | null;
}> = ({ data }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      {data === null ? (
        <Typography>None</Typography>
      ) : (
        <>
          <SiteLink
            data-monitoring-id={monitoringIds.GOTO_RAID}
            label={data.type.name}
            href={uiRoutes.raidActivity.href(data.id)}
          />
          {data.note === null ? null : (
            <Typography variant="body2" color="text.secondary">
              {data.note}
            </Typography>
          )}
        </>
      )}
    </CellLayout>
  );
};
