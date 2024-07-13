import { Skeleton, Typography, TypographyProps } from "@mui/material";
import { FC } from "react";

export const CountTypography: FC<{
  width: number;
  noun: string;
  count?: number;
  variant?: TypographyProps["variant"];
  color?: TypographyProps["color"];
}> = ({ width, noun, count, variant, color }) => {
  const nouns = count === undefined ? "" : noun + (count === 1 ? "" : "s");
  return (
    <Typography variant={variant} color={color}>
      {count === undefined ? (
        <Skeleton width={width} />
      ) : (
        count.toLocaleString()
      )}{" "}
      {nouns}
    </Typography>
  );
};
