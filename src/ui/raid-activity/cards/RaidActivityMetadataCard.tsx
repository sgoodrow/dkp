"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Skeleton, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { StatCard } from "@/ui/shared/components/cards/StatCard";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import { transaction } from "@/shared/utils/transaction";
import { meanBy } from "lodash";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

export const RaidActivityMetadataCard: FC<{ id: number }> = ({ id }) => {
  const { data: summary } = trpc.raidActivity.get.useQuery({
    id,
  });
  const note = summary === undefined ? undefined : summary.note;
  const attendance =
    summary === undefined
      ? undefined
      : summary.transactions.filter(transaction.isClearedAttendance);
  return (
    <LabeledCard
      title="Raid Activity"
      titleBar={<DateTypography date={summary?.createdAt} />}
      labelId="raid-activity-label"
    >
      <OverflowTooltipTypography width={1}>
        {note === null
          ? "No notes were added to this raid activity."
          : note || <Skeleton />}
      </OverflowTooltipTypography>
      <Box>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Attendance rate"
              value={
                attendance === undefined ? (
                  <Skeleton />
                ) : attendance.length === 0 ? (
                  "None"
                ) : (
                  meanBy(attendance, (t) => t.amount)
                )
              }
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard label="Raid activity type" value={summary?.type.name} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Number of bots"
              value={
                attendance === undefined ? (
                  <Skeleton />
                ) : (
                  attendance.filter((t) => t.character?.defaultPilotId === null)
                    .length
                )
              }
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
