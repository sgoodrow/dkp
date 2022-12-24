import { Box, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

export const LabeledField: FC<{ label: string; value: string | ReactNode }> = ({
  label,
  value,
}) => (
  <Box>
    <Typography variant="caption" textTransform="uppercase" color="secondary">
      {label}
    </Typography>
    <Box ml={1} />
    {typeof value === "function" ? (
      value
    ) : (
      <Typography variant="body1">
        <strong>{value}</strong>
      </Typography>
    )}
  </Box>
);
