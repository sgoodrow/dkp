import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { TypographyCell } from "@/ui/shared/components/tables/TypographyCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";

export const getTransactionContextColumn = (): Column<TransactionRow> => ({
  headerName: "Context",
  field: "raidActivity.type.name",
  flex: 1,
  cellRenderer: ({ data }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : data.raidActivity === null ? (
      <TypographyCell color="text.secondary">Unknown</TypographyCell>
    ) : (
      <CellLayout>
        <OverflowTooltipTypography>
          {data.raidActivity.type.name}
        </OverflowTooltipTypography>
        <OverflowTooltipTypography variant="body2" color="text.secondary">
          {data.reason}
        </OverflowTooltipTypography>
      </CellLayout>
    );
  },
});
