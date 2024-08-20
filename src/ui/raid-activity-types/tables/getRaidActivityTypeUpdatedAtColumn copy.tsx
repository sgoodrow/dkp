import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { AssignRaidActivityTypeNameDialog } from "@/ui/raid-activity-types/dialogs/AssignRaidActivityTypeNameDialog";
import { RaidActivityTypeNameCell } from "@/ui/raid-activity-types/tables/RaidActivityTypeNameCell";

export const getRaidActivityTypeNameColumn = ({
  editable,
}: {
  editable?: boolean;
}): Column<RaidActivityTypeRow> => ({
  headerName: "Name",
  field: "name",
  editable,
  cellEditor: (props) => (
    <AssignRaidActivityTypeNameDialog
      raidActivityTypeId={props.data.id}
      name={props.data.name}
      onAssign={() => handleCellEdited(props)}
      onClose={() => handleCellEditorClosed(props)}
    />
  ),
  cellRenderer: (props) => (
    <RaidActivityTypeNameCell
      {...props}
      onAssign={() => props.api.refreshInfiniteCache()}
    />
  ),
});
