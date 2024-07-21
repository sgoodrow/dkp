"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { Typography } from "@mui/material";
import { FC, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { Table } from "@/ui/shared/components/tables/Table";

const col =
  createColumnHelper<TrpcRouteOutputs["raidActivity"]["getMany"][number]>();

const columns = [
  col.accessor("type.name", {
    header: () => "Name",
    cell: (info) => <Typography>{info.row.original.type.name}</Typography>,
  }),
  //   col.accessor("createdAt", {
  //     header: () => "Uploaded",
  //     cell: (info) => (
  //       <Typography>{info.row.original.createdAt.toISOString()}</Typography>
  //     ),
  //   }),
  col.accessor("_count.attendees", {
    header: () => "Attendants",
    cell: (info) => (
      <Typography>{info.row.original._count.attendees}</Typography>
    ),
  }),
  col.accessor("_count.drops", {
    header: () => "Drops",
    cell: (info) => <Typography>{info.row.original._count.drops}</Typography>,
  }),
  col.accessor("payout", {
    header: () => "Payout",
    cell: (info) => <Typography>{info.row.original.payout}</Typography>,
  }),
  col.accessor("note", {
    header: () => "Note",
    cell: (info) => (
      <OverflowTooltipTypography>
        {info.row.original.note}
      </OverflowTooltipTypography>
    ),
  }),
];

export const RaidsTable: FC<{}> = ({}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data } = trpc.raidActivity.getMany.useQuery({ sorting });

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: "onChange",
  });

  return <Table table={table} />;
};
