"use client";

import { InfoIcon } from "@/ui/shared/components/icons/InfoIcon";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import {
  Box,
  CardHeaderProps,
  Paper,
  Stack,
  TooltipProps,
} from "@mui/material";
import { ReactNode } from "react";

export const LabeledCard: FCWithChildren<{
  labelId?: string;
  title?: ReactNode;
  titleAvatar?: CardHeaderProps["avatar"];
  titleInfo?: TooltipProps["title"];
  titleBar?: ReactNode;
}> = ({ labelId, title, titleAvatar, titleInfo, titleBar, children }) => {
  return (
    <Stack
      component={Paper}
      role="region"
      aria-labelledby={labelId}
      p={2}
      spacing={2}
    >
      {title && (
        <Stack direction="row" spacing={1} alignItems="center">
          {titleAvatar}
          <OverflowTooltipTypography id={labelId} variant="h5">
            {title}
          </OverflowTooltipTypography>
          {titleInfo && <InfoIcon title={titleInfo} />}
          <Box flexGrow={1} />
          {titleBar}
        </Stack>
      )}
      {children}
    </Stack>
  );
};
