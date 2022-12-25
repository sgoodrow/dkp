import { lighten, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import type { FC } from "react";

interface TextProps {
  text: string;
  terminating?: boolean;
  color?: string;
}
const Text: FC<TextProps> = ({
  text,
  terminating = false,
  color = blue[300],
}) => (
  <>
    {" "}
    <Typography
      sx={{
        display: "inline",
        textDecoration: "underline",
        textDecorationColor: lighten(color, 0.3),
        textDecorationThickness: "2px",
        textUnderlineOffset: "2px",
        fontWeight: "bold",
        color,
      }}
    >
      {text}
    </Typography>
    {!terminating && " "}
  </>
);

export const AnchorText: FC<TextProps & { to: string }> = ({
  text,
  terminating = false,
  color = blue[300],
  to,
}) => (
  <a href={to} rel="noreferrer" target="_blank">
    <Text text={text} terminating={terminating} color={color} />
  </a>
);

export const RouteText: FC<TextProps & LinkProps> = ({
  text,
  terminating = false,
  color = blue[300],
  ...rest
}) => (
  <Link {...rest}>
    <Text text={text} terminating={terminating} color={color} />
  </Link>
);
