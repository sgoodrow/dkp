import { RaidActivityClassDistributionCard } from "@/ui/raid-activity/cards/RaidActivityClassDistributionCard";
import { RaidActivityContributionsCard } from "@/ui/raid-activity/cards/RaidActivityContributionsCard";
import { RaidActivitySummaryCard } from "@/ui/raid-activity/cards/RaidActivitySummaryCard";
import { Box, Unstable_Grid2 } from "@mui/material";
import { FC } from "react";

export const RaidActivityRoutePage: FC<{ id: number }> = ({ id }) => {
  return (
    <Unstable_Grid2 container width={1} spacing={1}>
      <Unstable_Grid2 xs={12} sm={12} md={12} lg={9} xl={9}>
        <Box width={1}>
          <Unstable_Grid2 container spacing={1}>
            <Unstable_Grid2 xs={12} sm={12} md={12} lg={12} xl={12}>
              <RaidActivitySummaryCard id={id} />
            </Unstable_Grid2>
            <Unstable_Grid2 xs={12} sm={12} md={12} lg={12} xl={12}>
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
