import { Avatar, useTheme } from "@mui/material";
import type { FC } from "react";

export const CustomIcon: FC<{
  src: string;
  alt: string;
  bgcolor: string;
}> = ({ src, alt, bgcolor }) => {
  const theme = useTheme();
  return (
    <Avatar
      sx={{
        bgcolor,
        boxShadow: theme.shadows[5],
      }}
    >
      <img src={src} alt={alt} width="28px" />
    </Avatar>
  );
};
