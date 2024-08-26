import { Column } from "@/ui/shared/components/tables/InfiniteTable";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const getRaidActivityTypeUpdatedByColumn =
  (): Column<RaidActivityTypeRow> => ({
    headerName: "Updated By",
    field: "updatedBy",
    sortable: true,
    filter: "agTextColumnFilter",
    suppressNavigable: true,
    cellRenderer: (props) =>
      props.data === undefined ? (
        <LoadingCell />
      ) : (
        <CellLayout>
          <PlayerLink user={props.data.updatedBy} />
        </CellLayout>
      ),
  });
