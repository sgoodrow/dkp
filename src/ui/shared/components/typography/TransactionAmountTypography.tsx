import { Skeleton, useTheme } from "@mui/material";
import { FC } from "react";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

export const TransactionAmountTypography: FC<{
  amount?: number | null;
}> = ({ amount }) => {
  const theme = useTheme();
  const sign = (amount || 0) >= 0 ? 1 : -1;
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
      {sign >= 0 ? "+" : ""}
      {(amount || 0).toFixed(1)}
    </OverflowTooltipTypography>
  );
};
