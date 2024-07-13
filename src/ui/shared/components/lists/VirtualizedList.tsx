"use client";

import React, { FC, forwardRef, useEffect, useRef } from "react";
import {
  List as MuiList,
  ListItem,
  ListItemButton,
  Skeleton,
  Paper,
  Box,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { ChevronRight, FiberManualRecord } from "@mui/icons-material";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

const OPTION_HEIGHT = 29;
const PAPER_BORDER_HEIGHT = 2;

export const VirtualizedList: FC<{
  "data-monitoring-id": string;
  selectedId?: number;
  options?: {
    id: number;
    href: string;
    label: string;
  }[];
}> = ({ "data-monitoring-id": dataMonitoringId, selectedId, options }) => {
  const virtuoso = useRef<VirtuosoHandle>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!options) {
      return;
    }
    virtuoso.current?.scrollIntoView({
      behavior: "auto",
      index: options.findIndex((p) => p.id === selectedId),
    });
  }, [options, selectedId]);

  // Ensure the virtualized list height is sufficient to show a few options
  const minNumOptionsDisplay = Math.min(options?.length || 0, 10);
  const minHeight = minNumOptionsDisplay * OPTION_HEIGHT + PAPER_BORDER_HEIGHT;

  return (
    <Box sx={{ height: 1 }}>
      {!options || !selectedId ? (
        <Skeleton height="100%" variant="rectangular" sx={{ m: 1 }} />
      ) : (
        <Virtuoso
          ref={virtuoso}
          style={{ minHeight, height: "100%" }}
          data={options}
          components={{
            // We are currently pinned to v4.6.3 due to this issue:
            // https://github.com/petyosi/react-virtuoso/issues/875
            // This ignores an erroneous type error that is resolved in v4.7.2:
            // https://github.com/petyosi/react-virtuoso/issues/1045
            // @ts-ignore
            List: forwardRef(function Inner({ style, children }, listRef) {
              return (
                <Paper sx={{ mx: `${PAPER_BORDER_HEIGHT}px` }}>
                  <MuiList component={Box} style={style} ref={listRef}>
                    {children}
                  </MuiList>
                </Paper>
              );
            }),
            Item: ({ children, ...props }) => {
              return (
                <ListItem disablePadding {...props}>
                  {children}
                </ListItem>
              );
            },
          }}
          itemContent={(_, o) => {
            const selected = o.id === selectedId;
            return (
              <>
                <ListItemButton
                  key={o.id}
                  data-monitoring-id={dataMonitoringId}
                  href={o.href}
                  selected={selected}
                >
                  <ListItemIcon sx={{ minWidth: theme.spacing(4) }}>
                    {selected && (
                      <FiberManualRecord
                        sx={{ fontSize: 10 }}
                        color="secondary"
                      />
                    )}
                  </ListItemIcon>
                  <OverflowTooltipTypography sx={{ flexGrow: 1 }}>
                    {o.label}
                  </OverflowTooltipTypography>
                  <ListItemIcon sx={{ minWidth: theme.spacing(1) }}>
                    <ChevronRight fontSize="small" color="secondary" />
                  </ListItemIcon>
                </ListItemButton>
              </>
            );
          }}
        />
      )}
    </Box>
  );
};
