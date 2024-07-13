"use client";

import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { DataSourceIcon } from "@/ui/shared/components/icons/DataSourceIcon";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import {
  Box,
  Chip,
  Link,
  Skeleton,
  chipClasses,
  useTheme,
} from "@mui/material";
import { FC, useState } from "react";

export const CitationChip: FC<{
  citation?: {
    id: number;
    title: string;
    datasource: string;
    documentType: string;
    href: string;
  };
  maxWidth?: number;
}> = ({ citation, maxWidth }) => {
  const { id, title, datasource, documentType, href } = citation || {};
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const loading = id === undefined;
  const disabled = !href;
  return (
    <Chip
      data-monitoring-id={monitoringIds.GOTO_CITATION_URL}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variant="outlined"
      size="medium"
      disabled={disabled}
      icon={
        datasource === undefined ? (
          <Box sx={{ pl: 0.75 }}>
            <Skeleton variant="circular" width="18px" />
          </Box>
        ) : (
          <DataSourceIcon
            hovered={disabled ? false : hovered}
            datasource={datasource}
            documentType={documentType}
            color="primary"
            sx={{ pl: 0.5 }}
          />
        )
      }
      label={
        <OverflowTooltipTypography>
          {title === undefined ? (
            <Skeleton />
          ) : title === null ? (
            "Unknown citation"
          ) : (
            title
          )}
        </OverflowTooltipTypography>
      }
      component={disabled ? "div" : Link}
      target="_blank"
      href={href || ""}
      clickable={!disabled}
      sx={{
        color: href ? theme.palette.primary.main : undefined,
        m: 0.5,
        minWidth: loading ? maxWidth : undefined,
        maxWidth,
        [`.${chipClasses.label}`]: {
          flexGrow: 1,
        },
      }}
    />
  );
};
