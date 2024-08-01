"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Typography, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { StatCard } from "@/ui/shared/components/cards/LabeledCard copy";
import { uiRoutes } from "@/app/uiRoutes";
import { transaction } from "@/shared/utils/transaction";

export const RaidActivityTransactionSummaryCard: FC<{ id: number }> = ({
  id,
}) => {
  const { data: summary } = trpc.raidActivity.get.useQuery({
    id,
  });
  const clearedAttendanceTransactions =
    summary === undefined
      ? undefined
      : summary.transactions.filter(transaction.isCleared);
  const clearedAdjustmentTransactions =
    summary === undefined
      ? undefined
      : summary.transactions.filter(transaction.isClearedAdjustment);
  const clearedPurchaseTransactions =
    summary === undefined
      ? undefined
      : summary.transactions.filter(transaction.isClearedPurchase);
  const pendingTransactions =
    summary === undefined
      ? undefined
      : summary.transactions.filter(transaction.isPending);
  return (
    <LabeledCard
      title="Transaction Summary"
      titleAvatar={<uiRoutes.transactions.icon />}
      labelId="raid-activity-transaction-summary-label"
    >
      <Typography>
        Top-level information about the raid activity&apos;s transactions.
      </Typography>
      <Box>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Attendees"
              value={clearedAttendanceTransactions?.length}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Adjustments"
              value={clearedAdjustmentTransactions?.length}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Purchases"
              value={clearedPurchaseTransactions?.length}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Pending Transactions"
              value={pendingTransactions?.length}
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
