"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Typography, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { Note } from "@mui/icons-material";
import { StatCard } from "@/ui/shared/components/cards/LabeledCard copy";
import { sumBy } from "lodash";
import { transaction } from "@/shared/utils/transaction";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";

export const RaidActivityContributionsCard: FC<{ id: number }> = ({ id }) => {
  const { data: summary } = trpc.raidActivity.get.useQuery({
    id,
  });
  const { data: wallet } = trpc.wallet.getCurrentUserWallet.useQuery();
  const myTransactions =
    summary === undefined || wallet === undefined
      ? undefined
      : summary.transactions.filter((t) => t.walletId === wallet.id);
  const myClearedTransactions = myTransactions?.filter(transaction.isCleared);
  const myPendingTransactions = myTransactions?.filter(transaction.isPending);
  const earned =
    myClearedTransactions === undefined
      ? undefined
      : sumBy(
          myClearedTransactions
            ?.filter((t) => ["ATTENDANCE", "ADJUSTMENT"].includes(t.type))
            .map((t) => t.amount),
        );
  const spent =
    myClearedTransactions === undefined
      ? undefined
      : sumBy(
          myClearedTransactions
            ?.filter((t) => ["PURCHASE"].includes(t.type))
            .map((t) => t.amount),
        );
  return (
    <LabeledCard
      title="My Contribution"
      titleAvatar={<Note />}
      labelId="raid-activity-contribution-label"
    >
      {myClearedTransactions?.length === 0 &&
      myPendingTransactions?.length === 0 ? (
        <Typography color="text.secondary">
          There are no records of you contributing to this raid activity.
        </Typography>
      ) : (
        <>
          <Typography>
            What you earned by contributing to this raid activity.
          </Typography>
          <Box>
            <Unstable_Grid2 container spacing={1}>
              <Unstable_Grid2 xs={6}>
                <StatCard
                  label="DKP Earned"
                  value={
                    <TransactionAmountTypography amount={earned} positive />
                  }
                />
              </Unstable_Grid2>
              <Unstable_Grid2 xs={6}>
                <StatCard
                  label="DKP Spent"
                  value={
                    <TransactionAmountTypography
                      amount={spent}
                      positive={false}
                    />
                  }
                />
              </Unstable_Grid2>
            </Unstable_Grid2>
          </Box>
        </>
      )}
    </LabeledCard>
  );
};
