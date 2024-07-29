import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";

export const DateTypography: FC<{ date: Date }> = ({ date }) => {
  const day = dayjs(date);
  return (
    <>
      <OverflowTooltipTypography>
        {day.format("MM/DD/YYYY")}
      </OverflowTooltipTypography>
      <OverflowTooltipTypography color="text.secondary" variant="body2">
        {day.fromNow()}
      </OverflowTooltipTypography>
    </>
  );
};
