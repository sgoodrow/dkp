import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { CharacterRow } from "@/ui/characters/tables/character";

export const getCharacterRaceColumn = (): Column<CharacterRow> => ({
  field: "race.name",
  headerName: "Race",
  sortable: true,
  filter: "agTextColumnFilter",
});
