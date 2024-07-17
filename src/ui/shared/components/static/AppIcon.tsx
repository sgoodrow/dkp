import { EmojiIcon } from "@/ui/shared/components/icons/EmojiIcon";
import { app } from "@/shared/constants/app";
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
      <EmojiIcon emoji={app.appTitleIcon} />
    </IconButton>
  );
};
