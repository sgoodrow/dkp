import { EmojiIcon } from "@/ui/shared/components/icons/EmojiIcon";
import { APP_TITLE, APP_TITLE_ICON } from "@/ui/shared/components/static/copy";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { Box, IconButton } from "@mui/material";
import { FC } from "react";

export const AppIcon: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <Box display="flex" alignItems="center" alignSelf="center">
      <IconButton
        sx={{
          pointerEvents: "none",
          cursor: "default",
          ":hover": {
            backgroundColor: "transparent",
          },
          ":focus-visible": {
            outline: "none",
          },
        }}
      >
        <EmojiIcon emoji={APP_TITLE_ICON} />
      </IconButton>
      {isMobile ? null : (
        <>
          <Box ml={1} />
          <OverflowTooltipTypography>{APP_TITLE}</OverflowTooltipTypography>
        </>
      )}
    </Box>
  );
};
