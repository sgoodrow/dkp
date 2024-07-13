import { Box, SvgIcon } from "@mui/material";
import { FC } from "react";

export const EmojiIcon: FC<{ emoji: string }> = ({ emoji }) => {
  return (
    <SvgIcon>
      <Box component="text" x="50%" y="50%" dy=".3em" textAnchor="middle">
        {emoji}
      </Box>
    </SvgIcon>
  );
};
