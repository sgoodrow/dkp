"use client";

import { IconButton } from "@mui/material";
import { FC, useMemo } from "react";
import { CopyToClipboardIconButton } from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { Edit } from "@mui/icons-material";
import { NumberCell } from "@/ui/shared/components/table/NumberCell";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import {
  Column,
  InfiniteTable,
} from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";

type Row = TrpcRouteOutputs["raidActivity"]["getMany"]["rows"][number];

export const RaidsTable: FC<{}> = ({}) => {
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
                props.value === undefined ? "" : uiRoutes.raid.href(props.value)
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
        width: 120,
        filter: "agDateColumnFilter",
        cellRenderer: (props) => <DateTypography date={props.value} />,
      },
      {
        headerName: "Name",
        field: "type.name",
        filter: "agTextColumnFilter",
        cellRenderer: (props) =>
          props.data === undefined ? (
            <LoadingCell />
          ) : (
            <CellLayout>
              <SiteLink
                data-monitoring-id={monitoringIds.GOTO_RAID}
                label={props.value}
                href={uiRoutes.raid.href(props.data?.id)}
              />
            </CellLayout>
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
      {
        headerName: "Note",
        field: "note",
        flex: 1,
        filter: "agTextColumnFilter",
      },
    ],
    [],
  );
  return (
    <InfiniteTable
      getRows={utils.raidActivity.getMany.fetch}
      columnDefs={columnDefs}
    />
  );
};
