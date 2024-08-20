import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { AdminRow } from "@/ui/admin/tables/AdminsTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";

export const getAdminLastActiveColumn = (): Column<AdminRow> => ({
  headerName: "Last Active",
  sortable: false,
  cellRenderer: (props) =>
    props.data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <DateTypography date={props.data.updatedTransactions?.[0]?.updatedAt} />
      </CellLayout>
    ),
  flex: 1,
  minWidth: 100,
});
