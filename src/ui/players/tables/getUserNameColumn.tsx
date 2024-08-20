import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { UserRow } from "@/ui/players/tables/PlayersTable";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const getUserNameColumn = (): Column<UserRow> => ({
  field: "displayName",
  headerName: "Name",
  sortable: false,
  minWidth: 100,
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <PlayerLink user={data} />
      </CellLayout>
    ),
});
