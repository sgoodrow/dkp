import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityRow } from "@/ui/raid-activities/tables/RaidActivitiesTable";
import { RaidActivityCell } from "@/ui/raid-activities/tables/RaidActivityCell";

export const getRaidActivityNameColumn = (): Column<RaidActivityRow> => ({
  headerName: "Name",
  field: "type.name",
  sortable: true,
  filter: "agTextColumnFilter",
  flex: 1,
  cellRenderer: (props) => (
    <RaidActivityCell
      data={props.data === undefined ? undefined : props.data}
    />
  ),
});
