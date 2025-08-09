import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { UserRow } from "@/ui/players/tables/PlayersTable";
import { NumberCell } from "@/ui/shared/components/tables/NumberCell";

export const getUserDkpColumn = (): Column<UserRow> => ({
  field: "walletBalance",
  headerName: "DKP",
  cellRenderer: ({ data }) => (
    <CellLayout>
      {data?.wallet === null ? null : data?.wallet?.id === undefined ? (
        <LoadingCell />
      ) : (
        <NumberCell value={data?.walletBalance} />
      )}
    </CellLayout>
  ),
});
