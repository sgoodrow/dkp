import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";

export const getTransactionCreatedAtColumn = (): Column<TransactionRow> => ({
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
