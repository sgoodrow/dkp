import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { OpenInNew } from "@mui/icons-material";
import { Link, TooltipProps, TypographyProps } from "@mui/material";
import { Property } from "csstype";
import { FC, ReactNode } from "react";

export const SiteLink: FC<{
  "data-monitoring-id": string;
  href?: string;
  label: ReactNode;
  tooltip?: ReactNode;
  inheritSize?: boolean;
  inheritColor?: boolean;
  color?: Property.Color;
  variant?: TypographyProps["variant"];
  placement?: TooltipProps["placement"];
  startIcon?: ReactNode;
}> = ({
  "data-monitoring-id": dataMonitoringId,
  href,
  label,
  tooltip,
  inheritSize,
  inheritColor,
  color,
  variant,
  placement,
  startIcon,
}) => {
  const isExternal = href?.startsWith("http");
  const typography = (
    <OverflowTooltipTypography
      tooltip={tooltip}
      component="span"
      fontSize={inheritSize ? "inherit" : undefined}
      fontWeight={inheritColor ? "bold" : undefined}
      placement={placement}
      variant={variant}
    >
      {startIcon}
      {label}
    </OverflowTooltipTypography>
  );
  return href ? (
    <Link
      data-monitoring-id={dataMonitoringId}
      maxWidth={1}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener" : undefined}
      href={href}
      color={inheritColor ? "inherit" : undefined}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        color,
      }}
    >
      {startIcon}
      {typography}
      {isExternal && <OpenInNew sx={{ ml: 0.25 }} fontSize="inherit" />}
    </Link>
  ) : (
    typography
  );
};
