import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { AdminRow } from "@/ui/admin/tables/AdminsTable";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const getAdminNameColumn = (): Column<AdminRow> => ({
  field: "displayName",
  headerName: "Name",
  sortable: false,
  minWidth: 100,
  flex: 1,
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <PlayerLink user={data} />
      </CellLayout>
    ),
});
