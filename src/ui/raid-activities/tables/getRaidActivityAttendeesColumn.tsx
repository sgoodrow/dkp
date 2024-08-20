import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityRow } from "@/ui/raid-activities/tables/RaidActivitiesTable";
import { NumberCell } from "@/ui/shared/components/tables/NumberCell";

export const getRaidActivityAttendeesColumn = (): Column<RaidActivityRow> => ({
  headerName: "Attendees",
  field: "_count.transactions",
  width: 130,
  sortable: true,
  cellRenderer: (props) => <NumberCell value={props.value} />,
});
