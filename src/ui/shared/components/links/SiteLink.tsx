import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { OpenInNew } from "@mui/icons-material";
import { Link } from "@mui/material";
import { FC } from "react";

export const SiteLink: FC<{
  "data-monitoring-id": string;
  href?: string;
  label: string;
  inheritColor?: boolean;
}> = ({
  "data-monitoring-id": dataMonitoringId,
  href,
  label,
  inheritColor,
}) => {
  const isExternal = href?.startsWith("http");
  const typography = (
    <OverflowTooltipTypography
      component="span"
      fontSize="inherit"
      fontWeight={inheritColor ? "bold" : undefined}
    >
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
      }}
    >
      {typography}
      {isExternal && <OpenInNew sx={{ ml: 0.25 }} fontSize="inherit" />}
    </Link>
  ) : (
    typography
  );
};
