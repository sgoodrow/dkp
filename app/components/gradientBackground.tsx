import { Box, keyframes } from "@mui/material";
import {
  deepOrange,
  deepPurple,
  indigo,
  pink,
  teal,
} from "@mui/material/colors";
import type { FC, ReactNode } from "react";

export const GradientBackground: FC<{
  children: ReactNode;
  colors?: string[];
}> = ({
  children,
  colors = [
    deepOrange[400],
    pink[400],
    teal[400],
    indigo[400],
    deepPurple[400],
  ],
}) => {
  const size = (colors.length - 1) * 100;
  return (
    <Box
      sx={{
        background: `linear-gradient(-45deg, ${colors.join(", ")})`,
        backgroundSize: `${size}% ${size}%`,
        animation: `${keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `} ${colors.length * 7}s ease infinite`,
      }}
      width={1}
      height={1}
    >
      {children}
    </Box>
  );
};
