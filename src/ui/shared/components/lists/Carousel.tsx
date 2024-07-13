import React, { useId } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Stack,
  Paper,
  useTheme,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { CopyCurrentLinkToClipboardButton } from "@/ui/shared/components/buttons/CopyCurrentLinkToClipboardButton";

export const getPreviousIndex = (index: number, count: number) =>
  (index - 1 + count) % count;

export const getNextIndex = (index: number, count: number) =>
  (index + 1) % count;

export const Carousel: FCWithChildren<{
  ["data-monitoring-id"]: MonitoringId;
  title: string;
  currentIdIndex?: number;
  ids?: number[];
  nextHref: string;
  previousHref: string;
}> = ({
  "data-monitoring-id": dataMonitoringId,
  title,
  currentIdIndex,
  ids,
  nextHref,
  previousHref,
  children,
}) => {
  const theme = useTheme();
  const headerLabelId = `carousel-header-${useId()}`;

  const isLoading = ids === undefined || currentIdIndex === undefined;

  return (
    <Paper
      sx={{
        backgroundColor: theme.vars.palette.action.disabledBackground,
      }}
    >
      <AppBar
        position="static"
        sx={{
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
        }}
      >
        <Toolbar variant="dense">
          <Stack direction="row" spacing={1} alignItems="center" flexGrow={1}>
            <Typography variant="h6" id={headerLabelId}>
              {isLoading ? (
                <Skeleton width={100} />
              ) : (
                `${title} ${currentIdIndex + 1} of ${ids.length}`
              )}
            </Typography>
            <Tooltip
              title={
                previousHref ? `Previous ${title.toLowerCase()}` : undefined
              }
            >
              <Box>
                <IconButton
                  data-monitoring-id={dataMonitoringId}
                  href={previousHref}
                  disabled={!previousHref}
                  color="inherit"
                  aria-label="Previous item"
                >
                  <ArrowBackIosNew />
                </IconButton>
              </Box>
            </Tooltip>
            <Tooltip
              title={nextHref ? `Next ${title.toLowerCase()}` : undefined}
            >
              <Box>
                <IconButton
                  data-monitoring-id={dataMonitoringId}
                  href={nextHref}
                  disabled={!nextHref}
                  color="inherit"
                  aria-label="Next item"
                >
                  <ArrowForwardIos />
                </IconButton>
              </Box>
            </Tooltip>
            <Box flexGrow={1} />
            <CopyCurrentLinkToClipboardButton color="inherit" />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box role="region" aria-labelledby={headerLabelId} p={1}>
        {children}
      </Box>
    </Paper>
  );
};
