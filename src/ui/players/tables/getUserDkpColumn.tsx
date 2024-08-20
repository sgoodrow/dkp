import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { UserRow } from "@/ui/players/tables/PlayersTable";
import { PlayerDkpTypography } from "@/ui/shared/components/typography/PlayerDkpTypography";

export const getUserDkpColumn = (): Column<UserRow> => ({
  field: "id",
  headerName: "DKP",
  cellRenderer: ({ data }) => (
    <CellLayout>
      {data?.wallet === null ? null : data?.wallet.id === undefined ? (
        <LoadingCell />
      ) : (
        <PlayerDkpTypography walletId={data.wallet.id} />
      )}
    </CellLayout>
  ),
});
