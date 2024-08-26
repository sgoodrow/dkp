import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { RaidActivityRow } from "@/ui/raid-activities/tables/RaidActivitiesTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Typography } from "@mui/material";

export const getRaidActivityNoteColumn = (): Column<RaidActivityRow> => ({
  headerName: "Note",
  field: "note",
  sortable: true,
  filter: "agTextColumnFilter",
  flex: 1,
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        {!data.note ? (
          <Typography>None</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {data.note}
          </Typography>
        )}
      </CellLayout>
    ),
});
