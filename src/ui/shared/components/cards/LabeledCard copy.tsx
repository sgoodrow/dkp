import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

export const StatCard: FC<{ label: string; value?: ReactNode }> = ({
  label,
  value,
}) => {
  return (
    <Box component={Paper} elevation={2} p={1} flexGrow={1}>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" width="100%">
        {value === undefined ? <Skeleton /> : value}
      </Typography>
    </Box>
  );
};
