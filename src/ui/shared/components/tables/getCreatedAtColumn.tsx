import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { DateCell } from "@/ui/shared/components/tables/DateCell";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";

export const getCreatedAtColumn = (): Column<TransactionRow> => ({
  headerName: "Date",
  field: "createdAt",
  width: 150,
  sortable: true,
  filter: "agDateColumnFilter",
  cellRenderer: (props) => <DateCell {...props} />,
});
