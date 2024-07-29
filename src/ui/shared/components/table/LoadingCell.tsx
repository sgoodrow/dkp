import { Skeleton } from "@mui/material";
import { random } from "lodash";
import { FC, useRef } from "react";

export const LoadingCell: FC<{}> = ({}) => {
  const randomWidth = useRef(random(40, 100));
  return (
    <Skeleton
      height="100%"
      width={`${randomWidth.current}%`}
      sx={{
        alignContent: "center",
      }}
    />
  );
};
