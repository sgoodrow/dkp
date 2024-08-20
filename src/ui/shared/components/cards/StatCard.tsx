import {
  Card,
  CardContent,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";

export const StatCard: FC<{
  label: string;
  value?: ReactNode;
  loading?: boolean;
}> = ({ label, value, loading }) => {
  return (
    <Card component={Paper} elevation={2}>
      <CardContent component={Stack} spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" width={1}>
          {value === undefined ? <Skeleton /> : value}
        </Typography>
      </CardContent>
      <LinearProgress sx={{ visibility: loading ? "visible" : "hidden" }} />
    </Card>
  );
};
