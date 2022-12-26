import type { TypographyProps } from "@mui/material";
import { lighten, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import type { FC, ReactNode } from "react";

interface TextProps extends TypographyProps {
  children: ReactNode;
  terminating?: boolean;
  color?: string;
  hideUnderline?: boolean;
}
export const UnderlineText: FC<TextProps> = ({
  children,
  terminating = false,
  color = blue[300],
  hideUnderline = false,
  ...rest
}) => {
  const highlight = lighten(color, 0.3);
  return (
    <>
      {" "}
      <Typography
        sx={{
          display: "inline",
          textDecoration: hideUnderline ? "none" : "underline",
          textDecorationColor: highlight,
          textDecorationThickness: "2px",
          textUnderlineOffset: "0.15em",
          fontWeight: "bold",
          color,
          "&:hover": {
            color: highlight,
            textDecoration: hideUnderline ? "underline" : undefined,
            textDecorationThickness: "2px",
            textUnderlineOffset: "0.15em",
          },
        }}
        {...rest}
      >
        {children}
      </Typography>
      {!terminating && " "}
    </>
  );
};

interface AnchorTextProps extends TextProps {
  to: string;
}

export const AnchorText: FC<AnchorTextProps> = ({ to, ...rest }) => (
  <a href={to} rel="noreferrer" target="_blank">
    <UnderlineText {...rest} />
  </a>
);

interface RouteTextProps extends TextProps {
  to: LinkProps["to"];
}

export const RouteText: FC<RouteTextProps> = ({ to, ...rest }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <UnderlineText {...rest} />
  </Link>
);
