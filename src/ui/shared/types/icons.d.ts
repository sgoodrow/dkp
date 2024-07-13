import { SvgIconProps } from "@mui/material";

export type CustomSvgIconProps = Omit<
  SvgIconProps,
  "component" | "inheritViewBox"
>;
