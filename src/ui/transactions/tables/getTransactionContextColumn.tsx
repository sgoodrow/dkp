import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { TypographyCell } from "@/ui/shared/components/tables/TypographyCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";

export const getTransactionContextColumn = (): Column<TransactionRow> => ({
  headerName: "Context",
  field: "raidActivity.type.name",
  sortable: true,
  filter: "agTextColumnFilter",
  flex: 1,
  cellRenderer: ({ data }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : data.raidActivity === null ? (
      <TypographyCell color="text.secondary">Unknown</TypographyCell>
    ) : (
      <CellLayout>
        <SiteLink
          data-monitoring-id={monitoringIds.GOTO_RAID_ACTIVITY_SUMMARY}
          href={uiRoutes.raidActivity.href(data.raidActivity.id)}
          label={data.raidActivity.type.name}
        />
        <OverflowTooltipTypography variant="body2" color="text.secondary">
          {data.reason}
        </OverflowTooltipTypography>
      </CellLayout>
    );
  },
});
