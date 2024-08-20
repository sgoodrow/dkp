import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { CharacterRow } from "@/ui/characters/tables/character";

export const getCharacterNameColumn = (): Column<CharacterRow> => ({
  field: "name",
  headerName: "Name",
  sortable: true,
  flex: 1,
  filter: "agTextColumnFilter",
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <CharacterLink character={data} />
      </CellLayout>
    ),
});
