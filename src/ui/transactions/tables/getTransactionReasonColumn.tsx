import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";

export const getTransactionReasonColumn = (): Column<TransactionRow> => ({
  headerName: "Reason",
  field: "reason",
  flex: 1,
  cellRenderer: ({ data }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout>
        <OverflowTooltipTypography>{data.reason}</OverflowTooltipTypography>
      </CellLayout>
    );
  },
});
