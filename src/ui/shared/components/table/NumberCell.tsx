import { Cell } from "@/ui/shared/components/table/Cell";
import { Typography } from "@mui/material";
import { FC } from "react";

export const NumberCell: FC<{ value?: number }> = ({ value }) => {
  return (
    <Cell isLoading={value === undefined}>
      <Typography fontFamily="monospace">{value}</Typography>
    </Cell>
  );
};
