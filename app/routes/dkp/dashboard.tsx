import type { GridProps } from "@mui/material";
import { Box, Grid, Paper, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";
import { Outlet } from "@remix-run/react";

export default () => (
  <>
    <Grid container spacing={2}>
      <Card xs={12}>
        <Typography variant="h6">Dashboard</Typography>
      </Card>
      <Card xs={6}>
        <Outlet />
      </Card>
    </Grid>
  </>
);

const Card: FC<{ xs: GridProps["xs"]; children: ReactNode }> = ({
  xs,
  children,
}) => (
  <Grid item xs={xs}>
    <Box p={2} borderRadius={1} component={Paper} elevation={3}>
      {children}
    </Box>
  </Grid>
);
