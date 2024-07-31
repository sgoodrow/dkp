import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import dayjs from "dayjs";
import { FC } from "react";

export const DateTypography: FC<{ date?: Date }> = ({ date }) => {
  if (date === undefined) {
    return (
      <OverflowTooltipTypography color="text.secondary" variant="body2">
        Never
      </OverflowTooltipTypography>
    );
  }
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
