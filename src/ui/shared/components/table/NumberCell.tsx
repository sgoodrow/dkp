import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { FC } from "react";

export const NumberCell: FC<{ value?: number }> = ({ value }) => {
  return value === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <OverflowTooltipTypography fontFamily="monospace">
        {value}
      </OverflowTooltipTypography>
    </CellLayout>
  );
};
