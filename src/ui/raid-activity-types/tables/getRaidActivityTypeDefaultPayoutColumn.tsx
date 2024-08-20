import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { AssignRaidActivityTypeDefaultPayoutDialog } from "@/ui/raid-activity-types/dialogs/AssignRaidActivityTypeDefaultPayoutDialog";
import { RaidActivityTypeDefaultPayoutCell } from "@/ui/raid-activity-types/tables/RaidActivityTypeDefaultPayoutCell";

export const getRaidActivityTypeDefaultPayoutColumn = ({
  editable,
}: {
  editable?: boolean;
}): Column<RaidActivityTypeRow> => ({
  headerName: "Default Payout",
  field: "defaultPayout",
  width: 170,
  sortable: true,
  editable,
  filter: "agTextColumnFilter",
  cellEditor: (props) => (
    <AssignRaidActivityTypeDefaultPayoutDialog
      defaultPayout={props.data.defaultPayout}
      raidActivityTypeId={props.data.id}
      onAssign={() => handleCellEdited(props)}
      onClose={() => handleCellEditorClosed(props)}
    />
  ),
  cellRenderer: (props) => (
    <RaidActivityTypeDefaultPayoutCell
      {...props}
      onAssign={() => props.api.refreshInfiniteCache()}
    />
  ),
});
