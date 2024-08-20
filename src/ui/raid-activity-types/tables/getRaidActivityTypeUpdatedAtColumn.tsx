import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";

export const getRaidActivityTypeUpdatedAtColumn =
  (): Column<RaidActivityTypeRow> => ({
    headerName: "Last Updated",
    field: "updatedAt",
    width: 150,
    sortable: true,
    suppressNavigable: true,
    filter: "agDateColumnFilter",
    cellRenderer: ({ data }) =>
      data === undefined ? (
        <LoadingCell />
      ) : (
        <CellLayout>
          <DateTypography date={data.updatedAt} />
        </CellLayout>
      ),
  });
