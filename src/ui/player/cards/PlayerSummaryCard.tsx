"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { StatCard } from "@/ui/shared/components/cards/StatCard";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";

export const PlayerSummaryCard: FC<{ id: string }> = ({ id }) => {
  const { data } = trpc.wallet.getUserDkp.useQuery({ userId: id });

  return (
    <LabeledCard title="Summary" labelId="user-summary-label">
      <Box>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="Lifetime earned"
              value={<TransactionAmountTypography amount={data?.earnedDkp} />}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="Spent"
              value={<TransactionAmountTypography amount={data?.spentDkp} />}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="Current"
              value={<TransactionAmountTypography amount={data?.current} />}
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
