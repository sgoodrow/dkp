import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { Outlet } from "@remix-run/react";
import { GradientBackground } from "~/components/gradientBackground";
import { GuildIcon } from "~/components/guildIcon";
import { config } from "~/config";

export default () => (
  <GradientBackground>
    <Container
      maxWidth="sm"
      sx={{
        height: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box width={1} p={3} elevation={3} borderRadius={3} component={Paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h3">{config.guildName} DKP</Typography>
              <Box ml={1} />
              <GuildIcon />
            </Box>
          </Grid>
          <Outlet />
        </Grid>
      </Box>
    </Container>
  </GradientBackground>
);
