import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { AdminRow } from "@/ui/admin/tables/AdminsTable";

export const getAdminUpdatedTransactionsColumn = (): Column<AdminRow> => ({
  headerName: "Updated Transactions",
  field: "_count.updatedTransactions",
  flex: 1,
  minWidth: 100,
  sortable: true,
});
