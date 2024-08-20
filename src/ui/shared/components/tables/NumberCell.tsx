import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { FC } from "react";

export const NumberCell: FC<{ value?: number; digits?: number }> = ({
  value,
  digits,
}) => {
  return value === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <OverflowTooltipTypography fontFamily="monospace">
        {digits === undefined ? value : value.toFixed(digits)}
      </OverflowTooltipTypography>
    </CellLayout>
  );
};
