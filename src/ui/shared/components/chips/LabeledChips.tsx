"use client";

import { Box, Chip, ChipProps, Skeleton, Typography } from "@mui/material";
import { FC, useId } from "react";
import { sortBy, uniq } from "lodash";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

const LOADING_CHIP_WIDTH = 140;

type LabeledChipProps = Omit<ChipProps, "label" | "sx">;

export const LabeledChips: FC<{
  label: string;
  values?: string[];
  chipProps?: LabeledChipProps;
}> = ({ values, chipProps = {}, label = "primary" }) => {
  const chipStackLabelId = `chip-stack-label-${useId()}`;
  const sorted = values ? sortBy(uniq(values)) : undefined;

  const StyledChip: FCWithChildren = ({ children }) => (
    <Chip label={children} sx={{ m: 0.5, maxWidth: 200 }} {...chipProps} />
  );

  return (
    <Box display="flex" alignItems="baseline">
      <Typography
        variant="subtitle2"
        id={chipStackLabelId}
        noWrap
        sx={{ pr: 0.5 }}
      >
        {label}:
      </Typography>
      <Box role="region" aria-labelledby={chipStackLabelId}>
        {sorted ? (
          sorted.map((value) => (
            <StyledChip key={value}>
              <OverflowTooltipTypography>{value}</OverflowTooltipTypography>
            </StyledChip>
          ))
        ) : (
          <StyledChip>
            <Skeleton width={LOADING_CHIP_WIDTH} />
          </StyledChip>
        )}
      </Box>
    </Box>
  );
};
