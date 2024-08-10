"use client";

import { Box, keyframes } from "@mui/material";
import {
  deepOrange,
  deepPurple,
  indigo,
  pink,
  teal,
} from "@mui/material/colors";

export const GradientBox: FCWithChildren<{
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
  const gradientAnimation = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(-45deg, ${colors.join(", ")})`,
        backgroundSize: `${size}% ${size}%`,
        animation: `${gradientAnimation} ${colors.length * 7}s ease infinite`,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};
