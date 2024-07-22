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
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { ClassName } from "@/ui/shared/components/static/ClassName";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";

// const col =
//   createColumnHelper<TrpcRouteOutputs["character"]["getByUserId"][number]>();

// const columns = [
//   col.accessor("name", {
//     header: () => "Name",
//     cell: (info) => (
//       <Typography>
//         <CharacterLink
//           characterId={info.row.original.id}
//           characterName={info.row.original.name}
//         />
//       </Typography>
//     ),
//   }),
//   col.accessor("class.name", {
//     header: () => "Class",
//     cell: (info) => (
//       <ClassName
//         className={info.row.original.class.name}
//         colorHexDark={info.row.original.class.colorHexDark}
//         colorHexLight={info.row.original.class.colorHexLight}
//       />
//     ),
//   }),
//   col.accessor("race.name", {
//     header: () => "Race",
//     cell: (info) => <Typography>{info.row.original.race.name}</Typography>,
//   }),
// ];

export const MyCharactersTable: FC<{}> = ({}) => {
  const { data } = trpc.character.getByUserId.useQuery();

  return null;
};
