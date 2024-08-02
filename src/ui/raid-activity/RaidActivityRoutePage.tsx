import { RaidActivityClassDistributionCard } from "@/ui/raid-activity/cards/RaidActivityClassDistributionCard";
import { RaidActivityContributionsCard } from "@/ui/raid-activity/cards/RaidActivityContributionsCard";
import { RaidActivityMetadataCard } from "@/ui/raid-activity/cards/RaidActivityMetadataCard";
import { RaidActivityTransactionSummaryCard } from "@/ui/raid-activity/cards/RaidActivityTransactionSummaryCard";
import { Box, Unstable_Grid2 } from "@mui/material";
import { FC } from "react";

export const RaidActivityRoutePage: FC<{ id: number }> = ({ id }) => {
  return (
    <Unstable_Grid2 container width={1} spacing={1}>
      <Unstable_Grid2 xs={12} sm={12} md={12} lg={9} xl={9}>
        <Box width={1}>
          <Unstable_Grid2 container spacing={1}>
            <Unstable_Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
              <RaidActivityMetadataCard id={id} />
            </Unstable_Grid2>
            <Unstable_Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
              <RaidActivityTransactionSummaryCard id={id} />
            </Unstable_Grid2>
            <Unstable_Grid2 xs={12} sm={12} md={12} lg={6} xl={6}>
              <RaidActivityContributionsCard id={id} />
            </Unstable_Grid2>
          </Unstable_Grid2>
        </Box>
      </Unstable_Grid2>
      <Unstable_Grid2 xs={12} sm={12} md={12} lg={3} xl={3}>
        <RaidActivityClassDistributionCard id={id} />
      </Unstable_Grid2>
    </Unstable_Grid2>
  );
};
