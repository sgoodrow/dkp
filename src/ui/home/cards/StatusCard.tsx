"use client";

import { FC } from "react";
import { trpc } from "@/api/views/trpc/trpc";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Stack, Typography } from "@mui/material";

export const StatusCard: FC<{}> = () => {
  const { data } = trpc.user.getStatus.useQuery();
  return (
    <LabeledCard title="Status">
      <Stack spacing={1}>
        <Typography>You are logged in.</Typography>
      </Stack>
    </LabeledCard>
  );
};
