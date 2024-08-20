import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { UserRow } from "@/ui/players/tables/PlayersTable";
import { NumberCell } from "@/ui/shared/components/tables/NumberCell";

export const getUserCharactersColumn = (): Column<UserRow> => ({
  field: "_count.characters",
  headerName: "Number of Characters",
  sortable: true,
  cellRenderer: (props) => <NumberCell value={props.value} />,
});
