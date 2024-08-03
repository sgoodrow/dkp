import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { TypeColumnFilter } from "@/ui/transactions/tables/TypeColumnFilter";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { TransactionTypeIcon } from "@/ui/transactions/icons/TransactionTypeIcon";

export const getTransactionTypeColumn = (): Column<TransactionRow> => ({
  headerName: "Type",
  field: "type",
  width: 100,
  filter: TypeColumnFilter,
  cellRenderer: ({ data }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <TransactionTypeIcon type={data.type} />
      </CellLayout>
    );
  },
});
