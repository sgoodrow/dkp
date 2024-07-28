import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import dayjs from "dayjs";
import { FC } from "react";

export const DateTypography: FC<{ date: Date }> = ({ date }) => {
  const day = dayjs(date);
  return (
    <OverflowTooltipTypography tooltip={day.fromNow()} placement="left">
      {day.format("MM/DD/YYYY")}
    </OverflowTooltipTypography>
  );
};
