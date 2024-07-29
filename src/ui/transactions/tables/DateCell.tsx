import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { DateTypography } from "@/ui/shared/components/typography/DateTypography";

export const DateCell: FC<ICellRendererParams> = ({ data, value }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <DateTypography date={value} />
    </CellLayout>
  );
};
