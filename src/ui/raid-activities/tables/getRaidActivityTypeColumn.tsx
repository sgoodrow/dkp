import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityRow } from "@/ui/raid-activities/tables/RaidActivitiesTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { RaidActivityLink } from "@/ui/shared/components/links/RaidActivityLink";

export const getRaidActivityTypeColumn = (): Column<RaidActivityRow> => ({
  headerName: "Type",
  field: "type.name",
  sortable: true,
  filter: "agTextColumnFilter",
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <RaidActivityLink raidActivity={data} />
      </CellLayout>
    ),
});
