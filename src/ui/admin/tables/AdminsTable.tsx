"use client";

import { IconButton } from "@mui/material";
import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { CopyToClipboardIconButton } from "@/ui/shared/components/buttons/CopyToClipboardIconButton";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { uiRoutes } from "@/app/uiRoutes";
import { Edit } from "@mui/icons-material";
import { NumberCell } from "@/ui/shared/components/table/NumberCell";
import { DateCell } from "@/ui/shared/components/table/DateCell";
import { InfiniteTable } from "@/ui/shared/components/table/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { Cell } from "@/ui/shared/components/table/Cell";

export const AdminsTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  return null;
  // <InfiniteTable
  //   getRows={utils.user.getAdmins.fetch}
  //   columnDefs={[
  //     {
  //       headerName: "",
  //       field: "id",
  //       width: 50,
  //       resizable: false,
  //       cellRenderer: (props: ICellRendererParams) => (
  //         <CopyToClipboardIconButton
  //           data-monitoring-id={
  //             monitoringIds.COPY_RAID_ACTIVITY_LINK_TO_CLIPBOARD
  //           }
  //           value={
  //             props.value === undefined ? "" : uiRoutes.raid.href(props.value)
  //           }
  //           label="Copy raid activity link"
  //         />
  //       ),
  //     },
  //     {
  //       headerName: "",
  //       width: 50,
  //       resizable: false,
  //       cellRenderer: () => (
  //         <IconButton
  //           data-monitoring-id={monitoringIds.TOGGLE_EDIT_RAID_ACTIVITY_ROW}
  //           disabled
  //         >
  //           <Edit />
  //         </IconButton>
  //       ),
  //     },
  //     {
  //       headerName: "Date",
  //       field: "createdAt",
  //       width: 120,
  //       filter: "agDateColumnFilter",
  //       cellRenderer: (props: ICellRendererParams) => (
  //         <DateCell date={props.value} />
  //       ),
  //     },
  //     {
  //       headerName: "Name",
  //       field: "type.name",
  //       filter: "agTextColumnFilter",
  //       cellRenderer: (props: ICellRendererParams) => (
  //         <Cell isLoading={props.data === undefined}>
  //           <SiteLink
  //             data-monitoring-id={monitoringIds.GOTO_RAID}
  //             label={props.value}
  //             href={uiRoutes.raid.href(props.data?.id)}
  //           />
  //         </Cell>
  //       ),
  //     },
  //     // Prisma doesn't support multiple relation counts, so we only
  //     // include the attendees count here (i.e. we don't include the purchase count yet)
  //     // See: https://github.com/prisma/prisma/issues/15423
  //     {
  //       headerName: "Attendees",
  //       field: "_count.transactions",
  //       width: 130,
  //       // Prisma doesn't support filtering on relation counts
  //       // See: https://github.com/prisma/prisma/issues/8935
  //       // filter: "agNumberColumnFilter",
  //       cellRenderer: (props: ICellRendererParams) => (
  //         <NumberCell value={props.value} />
  //       ),
  //     },
  //     {
  //       headerName: "Note",
  //       field: "note",
  //       flex: 1,
  //       filter: "agTextColumnFilter",
  //     },
  //   ]}
  // />
};
