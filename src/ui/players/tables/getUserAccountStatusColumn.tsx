import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { UserRow } from "@/ui/players/tables/PlayersTable";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const getUserAccountStatusColumn = (): Column<UserRow> => ({
  field: "name",
  headerName: "Name",
  sortable: false,
  filter: "agTextColumnFilter",
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <PlayerLink user={data} />
      </CellLayout>
    ),
});
