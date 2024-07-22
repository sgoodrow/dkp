import { Cell } from "@/ui/shared/components/table/Cell";
import { Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";

export const DateCell: FC<{ date?: Date }> = ({ date }) => {
  const day = dayjs(date);
  return (
    <Cell isLoading={date === undefined}>
      <Tooltip title={day.fromNow()}>
        <Typography height="100%" alignContent="center" fontFamily="monospace">
          {day.format("MM/DD/YYYY")}
        </Typography>
      </Tooltip>
    </Cell>
  );
};
