import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";

export const DateCell: FC<ICellRendererParams<{ value?: Date }>> = ({
  value,
}) => {
  return value === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <DateTypography date={value} />
    </CellLayout>
  );
};
