import { EmojiIcon } from "@/ui/shared/components/icons/EmojiIcon";
import { APP_TITLE_ICON } from "@/ui/shared/components/static/copy";
import { IconButton } from "@mui/material";
import { FC } from "react";

export const AppIcon: FC<{}> = ({}) => {
  return (
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
  );
};
