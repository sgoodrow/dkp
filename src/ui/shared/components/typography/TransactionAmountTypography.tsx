import { Skeleton, useTheme } from "@mui/material";
import { FC } from "react";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

export const TransactionAmountTypography: FC<{
  amount?: number | null;
  positive: boolean;
}> = ({ amount, positive }) => {
  const theme = useTheme();
  const sign = positive ? 1 : -1;
  const color =
    sign > 0 ? theme.palette.success.main : theme.palette.error.main;
  return amount === undefined ? (
    <Skeleton />
  ) : (
    <OverflowTooltipTypography
      fontFamily="monospace"
      color={color}
      fontWeight="bold"
    >
      {sign >= 0 ? "+" : "-"}
      {amount || 0}
    </OverflowTooltipTypography>
  );
};
