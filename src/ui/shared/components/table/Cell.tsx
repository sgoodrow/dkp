import { Box, Skeleton } from "@mui/material";
import _, { random } from "lodash";
import { useRef } from "react";

export const Cell: FCWithChildren<{ isLoading: boolean }> = ({
  isLoading,
  children,
}) => {
  const randomWidth = useRef(random(40, 100));
  return (
    <Box height="100%" alignContent="center">
      {isLoading ? <Skeleton width={`${randomWidth.current}%`} /> : children}
    </Box>
  );
};
