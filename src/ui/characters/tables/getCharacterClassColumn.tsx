import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { ClassName } from "@/ui/shared/components/static/ClassName";
import { CharacterRow } from "@/ui/characters/tables/character";

export const getCharacterClassColumn = (): Column<CharacterRow> => ({
  field: "class.name",
  headerName: "Class",
  sortable: true,
  filter: "agTextColumnFilter",
  cellRenderer: (props) =>
    props.data == undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <ClassName
          className={props.data?.class.name}
          colorHexDark={props.data?.class.colorHexDark}
          colorHexLight={props.data?.class.colorHexLight}
        />
      </CellLayout>
    ),
});
