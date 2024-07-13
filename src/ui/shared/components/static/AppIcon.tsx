import { EmojiIcon } from "@/ui/shared/components/icons/EmojiIcon";
import { APP_TITLE, APP_TITLE_ICON } from "@/ui/shared/components/static/copy";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FC } from "react";

export const AppIcon: FC<{}> = ({}) => {
  return (
    <Tooltip title={`Welcome to ${APP_TITLE}.`} placement="right">
      <Box display="flex" justifyContent="center">
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
      </Box>
    </Tooltip>
  );
};
