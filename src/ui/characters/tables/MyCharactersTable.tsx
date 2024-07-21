"use client";

import { trpc } from "@/api/views/trpc/trpc";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { FC } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { ClassName } from "@/ui/shared/components/static/ClassName";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";

const col =
  createColumnHelper<TrpcRouteOutputs["character"]["getByUserId"][number]>();

const columns = [
  col.accessor("name", {
    header: () => "Name",
    cell: (info) => (
      <Typography>
        <CharacterLink
          characterId={info.row.original.id}
          characterName={info.row.original.name}
        />
      </Typography>
    ),
  }),
  col.accessor("class.name", {
    header: () => "Class",
    cell: (info) => (
      <ClassName
        className={info.row.original.class.name}
        colorHexDark={info.row.original.class.colorHexDark}
        colorHexLight={info.row.original.class.colorHexLight}
      />
    ),
  }),
  col.accessor("race.name", {
    header: () => "Race",
    cell: (info) => <Typography>{info.row.original.race.name}</Typography>,
  }),
];

export const MyCharactersTable: FC<{}> = ({}) => {
  const { data } = trpc.character.getByUserId.useQuery();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "name",
          desc: false,
        },
      ],
    },
  });

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sortDirection={header.column.getIsSorted()}
                >
                  <TableSortLabel
                    active={!!header.column.getIsSorted()}
                    direction={header.column.getNextSortingOrder() || undefined}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Typography fontWeight="bold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} hover>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
