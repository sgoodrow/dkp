"use client";

import {
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { ICellRendererParams, IDatasource } from "ag-grid-community";
import { CopyToClipboardIconButton } from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { Edit } from "@mui/icons-material";
import { NumberCell } from "@/ui/shared/components/table/NumberCell";
import { DateCell } from "@/ui/shared/components/table/DateCell";
import { InfiniteTable } from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { isEmpty } from "lodash";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { Cell } from "@/ui/shared/components/table/Cell";

export const RaidsTable: FC<{}> = ({}) => {
  const { data: rowCount } = trpc.raidActivity.getCount.useQuery();
  const utils = trpc.useUtils();

  const datasource: IDatasource = {
    getRows: async (params) => {
      const {
        startRow,
        endRow,
        filterModel,
        sortModel,
        successCallback,
        failCallback,
      } = params;
      if (startRow === undefined || endRow === undefined) {
        throw new Error("startRow and endRow must be defined");
      }
      try {
        const rows = await utils.raidActivity.getMany.fetch({
          startRow,
          endRow,
          filterModel: isEmpty(filterModel) ? undefined : filterModel,
          sortModel,
        });
        successCallback(rows, rowCount);
      } catch (err) {
        failCallback();
        throw err;
      }
    },
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="baseline">
        <Typography variant="h1">Raids</Typography>
        <Divider sx={{ flexGrow: 1, alignSelf: "center", pt: 1 }} />
        <Typography variant="h1">
          {rowCount === undefined ? <Skeleton width="100px" /> : rowCount}
        </Typography>
      </Stack>
      <InfiniteTable
        datasource={rowCount === undefined ? undefined : datasource}
        columnDefs={[
          {
            headerName: "",
            field: "id",
            width: 50,
            resizable: false,
            cellRenderer: (props: ICellRendererParams) => (
              <CopyToClipboardIconButton
                data-monitoring-id={
                  monitoringIds.COPY_RAID_ACTIVITY_LINK_TO_CLIPBOARD
                }
                value={
                  props.value === undefined
                    ? ""
                    : uiRoutes.raid.href(props.value)
                }
                label="Copy raid activity link"
              />
            ),
          },
          {
            headerName: "",
            width: 50,
            resizable: false,
            cellRenderer: () => (
              <IconButton
                data-monitoring-id={monitoringIds.TOGGLE_EDIT_RAID_ACTIVITY_ROW}
                disabled
              >
                <Edit />
              </IconButton>
            ),
          },
          {
            headerName: "Date",
            field: "createdAt",
            width: 120,
            filter: "agDateColumnFilter",
            cellRenderer: (props: ICellRendererParams) => (
              <DateCell date={props.value} />
            ),
          },
          {
            headerName: "Name",
            field: "type.name",
            filter: "agTextColumnFilter",
            cellRenderer: (props: ICellRendererParams) => (
              <Cell isLoading={props.data === undefined}>
                <SiteLink
                  data-monitoring-id={monitoringIds.GOTO_RAID}
                  label={props.value}
                  href={uiRoutes.raid.href(props.data?.id)}
                />
              </Cell>
            ),
          },
          {
            headerName: "Attendees",
            field: "_count.attendees",
            width: 120,
            // Prisma doesn't support filtering on relation counts
            // See: https://github.com/prisma/prisma/issues/8935
            // filter: "agNumberColumnFilter",
            cellRenderer: (props: ICellRendererParams) => (
              <NumberCell value={props.value} />
            ),
          },
          {
            headerName: "Drops",
            field: "_count.drops",
            width: 100,
            // Prisma doesn't support filtering on relation counts
            // See: https://github.com/prisma/prisma/issues/8935
            // filter: "agNumberColumnFilter",
            cellRenderer: (props: ICellRendererParams) => (
              <NumberCell value={props.value} />
            ),
          },
          {
            headerName: "Payout",
            field: "payout",
            width: 100,
            filter: "agNumberColumnFilter",
            cellRenderer: (props: ICellRendererParams) => (
              <NumberCell value={props.value} />
            ),
          },
          {
            headerName: "Note",
            field: "note",
            flex: 1,
            filter: "agTextColumnFilter",
          },
        ]}
      />
    </>
  );
};
