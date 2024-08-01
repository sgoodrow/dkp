"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Skeleton, Typography, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { Note } from "@mui/icons-material";
import { StatCard } from "@/ui/shared/components/cards/LabeledCard copy";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";
import { transaction } from "@/shared/utils/transaction";
import { meanBy } from "lodash";

export const RaidActivityMetadataCard: FC<{ id: number }> = ({ id }) => {
  const { data: summary } = trpc.raidActivity.get.useQuery({
    id,
  });
  const note = summary === undefined ? undefined : summary.note;
  return (
    <LabeledCard
      title="Raid Activity"
      titleAvatar={<Note />}
      titleBar={<DateTypography date={summary?.createdAt} />}
      labelId="raid-activity-label"
    >
      <Typography color="text.secondary" width={1}>
        {note === null
          ? "No notes were added to this raid activity."
          : note || <Skeleton />}
      </Typography>
      <Box>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Attendance payout"
              value={meanBy(
                summary?.transactions.filter(transaction.isClearedAttendance),
                (t) => t.amount,
              )}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard label="Raid activity type" value={summary?.type.name} />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
