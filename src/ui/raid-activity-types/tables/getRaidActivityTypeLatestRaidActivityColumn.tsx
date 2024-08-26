import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Typography } from "@mui/material";
import { RaidActivityLink } from "@/ui/shared/components/links/RaidActivityLink";

export const getRaidActivityTypeLatestRaidActivityColumn =
  (): Column<RaidActivityTypeRow> => ({
    headerName: "Latest Raid Activity",
    flex: 1,
    suppressNavigable: true,
    cellRenderer: ({ data }) => {
      const latest = data?.raidActivities?.[0] || null;
      return latest === undefined ? (
        <LoadingCell />
      ) : (
        <CellLayout>
          {latest === null ? (
            <Typography>None</Typography>
          ) : (
            <>
              <RaidActivityLink raidActivity={latest} />
              {latest.note === null ? null : (
                <Typography variant="body2" color="text.secondary">
                  {latest.note}
                </Typography>
              )}
            </>
          )}
        </CellLayout>
      );
    },
  });
