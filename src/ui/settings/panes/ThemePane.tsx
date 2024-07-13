import { ThemeModeIconButton } from "@/ui/navigation/buttons/ThemeModeIconButton";
import { Stack, Typography } from "@mui/material";
import { FC } from "react";

export const ThemePane: FC<{}> = ({}) => {
  return (
    <>
      <Typography variant="subtitle1">Theme</Typography>
      <Stack spacing={1}>
        <ThemeModeIconButton />
      </Stack>
    </>
  );
};
