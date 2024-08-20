import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import { CharacterRow } from "@/ui/characters/tables/character";

export const getCharacterCreatedAtColumn = (): Column<CharacterRow> => ({
  field: "createdAt",
  headerName: "Date",
  width: 150,
  sortable: true,
  filter: "agDateColumnFilter",
  cellRenderer: ({ data }) =>
    data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <DateTypography date={data.createdAt} />
      </CellLayout>
    ),
});
