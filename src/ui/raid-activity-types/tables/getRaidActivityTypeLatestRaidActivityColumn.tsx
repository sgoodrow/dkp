import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { RaidActivityCell } from "@/ui/raid-activities/tables/RaidActivityCell";

export const getRaidActivityTypeLatestRaidActivityColumn =
  (): Column<RaidActivityTypeRow> => ({
    headerName: "Latest Raid Activity",
    flex: 1,
    suppressNavigable: true,
    cellRenderer: (props) => (
      <RaidActivityCell
        data={
          props.data === undefined
            ? undefined
            : props.data.raidActivities?.[0] || null
        }
      />
    ),
  });
