"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { MyCharactersCard } from "@/ui/home/cards/MyCharactersCard";
import { Unstable_Grid2 } from "@mui/material";

export const HomeRoutePage = () => {
  const { data } = trpc.user.get.useQuery({});
  return (
    <Unstable_Grid2 container width={1} spacing={1}>
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={4}>
        <MyCharactersCard userId={data?.id} />
      </Unstable_Grid2>
    </Unstable_Grid2>
  );
};
