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
}) => (
  <Box
    sx={{
      background: `linear-gradient(-45deg, ${colors.join(", ")})`,
      backgroundSize: `${colors.length * 100}% ${colors.length * 100}%`,
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
    height={1}
  >
    {children}
  </Box>
);
