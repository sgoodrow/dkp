"use client";

import { IconButton } from "@mui/material";
import { FC, useMemo } from "react";
import { CopyToClipboardIconButton } from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { Edit } from "@mui/icons-material";
import { NumberCell } from "@/ui/shared/components/tables/NumberCell";
import {
  Column,
  InfiniteTable,
} from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateCell } from "@/ui/shared/components/tables/DateCell";
import { RaidActivityCell } from "@/ui/raid-activities/tables/RaidActivityCell";

type Row = TrpcRouteOutputs["raidActivity"]["getMany"]["rows"][number];

export const RaidActivitiesTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const columnDefs: Column<Row>[] = useMemo(
    () => [
      {
        headerName: "",
        field: "id",
        width: 50,
        resizable: false,
        cellRenderer: (props) => (
          <CellLayout>
            <CopyToClipboardIconButton
              data-monitoring-id={
                monitoringIds.COPY_RAID_ACTIVITY_LINK_TO_CLIPBOARD
              }
              value={
                props.value === undefined
                  ? ""
                  : uiRoutes.raidActivity.href(props.value)
              }
              label="Copy raid activity link"
            />
          </CellLayout>
        ),
      },
      {
        headerName: "",
        width: 50,
        resizable: false,
        cellRenderer: () => (
          <CellLayout>
            <IconButton
              data-monitoring-id={monitoringIds.TOGGLE_EDIT_RAID_ACTIVITY_ROW}
              disabled
            >
              <Edit />
            </IconButton>
          </CellLayout>
        ),
      },
      {
        headerName: "Date",
        field: "createdAt",
        width: 150,
        filter: "agDateColumnFilter",
        cellRenderer: (props) => <DateCell {...props} />,
      },
      {
        headerName: "Name",
        field: "type.name",
        filter: "agTextColumnFilter",
        flex: 1,
        cellRenderer: (props) => (
          <RaidActivityCell
            data={props.data === undefined ? undefined : props.data}
          />
        ),
      },
      // Prisma doesn't support multiple relation counts, so we only
      // include the attendees count here (i.e. we don't include the purchase count yet)
      // See: https://github.com/prisma/prisma/issues/15423
      {
        headerName: "Attendees",
        field: "_count.transactions",
        width: 130,
        // Prisma doesn't support filtering on relation counts
        // See: https://github.com/prisma/prisma/issues/8935
        // filter: "agNumberColumnFilter",
        cellRenderer: (props) => <NumberCell value={props.value} />,
      },
    ],
    [],
  );
  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.raidActivity.getMany.fetch}
      columnDefs={columnDefs}
    />
  );
};
