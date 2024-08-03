"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Skeleton, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { StatCard } from "@/ui/shared/components/cards/StatCard";
import { transaction } from "@/shared/utils/transaction";
import { meanBy } from "lodash";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";
import { statsBy } from "@/shared/utils/mathUtils";

export const RaidActivitySummaryCard: FC<{ id: number }> = ({ id }) => {
  const { data } = trpc.raidActivity.get.useQuery({
    id,
  });
  const note = data === undefined ? undefined : data.note;

  const attendance = data?.transactions.filter(transaction.isClearedAttendance);

  const cleared = data?.transactions.filter(transaction.isCleared);

  const clearedAttendane = data?.transactions.filter(transaction.isCleared);

  const clearedAdjustments = data?.transactions.filter(
    transaction.isClearedAdjustment,
  );

  const clearedPurchases = data?.transactions.filter(
    transaction.isClearedPurchase,
  );

  const earned = statsBy(
    cleared?.filter((t) => ["ATTENDANCE", "ADJUSTMENT"].includes(t.type)),
    (t) => t.amount,
  );

  const spent = statsBy(
    cleared?.filter((t) => t.type === "PURCHASE"),
    (t) => t.amount,
  );

  return (
    <LabeledCard title="Summary" labelId="raid-activity-label">
      <OverflowTooltipTypography width={1}>
        {note === null
          ? "No notes were added to this raid activity."
          : note || <Skeleton />}
      </OverflowTooltipTypography>
      <Box>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="DKP Earned"
              value={
                <TransactionAmountTypography
                  amount={earned ? earned.sum : earned}
                  positive
                />
              }
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="DKP Spent"
              value={
                <TransactionAmountTypography
                  amount={spent ? spent.sum : spent}
                  positive={false}
                />
              }
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="DKP Change"
              value={
                <TransactionAmountTypography
                  amount={
                    !earned ? earned : !spent ? spent : earned.sum - spent.sum
                  }
                  positive={
                    earned && spent ? earned.sum - spent.sum >= 0 : true
                  }
                />
              }
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard label="Purchases" value={clearedPurchases?.length} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard label="Adjustments" value={clearedAdjustments?.length} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6} sm={4}>
            <StatCard
              label="Attendees"
              value={
                <>
                  {clearedAttendane?.length}{" "}
                  {attendance?.length ? (
                    <>({meanBy(attendance, (t) => t.amount)} DKP each)</>
                  ) : null}
                </>
              }
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
