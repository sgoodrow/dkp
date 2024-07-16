import { Box, SvgIcon } from "@mui/material";
import { FC } from "react";

export const EmojiIcon: FC<{ emoji: string; hueRotation?: number }> = ({
  emoji,
  hueRotation,
}) => {
  return (
    <SvgIcon
      sx={{
        filter:
          hueRotation === undefined
            ? undefined
            : `hue-rotate(${hueRotation}deg)`,
      }}
    >
      <Box component="text" x="50%" y="50%" dy=".3em" textAnchor="middle">
        {emoji}
      </Box>
    </SvgIcon>
  );
};
