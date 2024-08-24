import { CircularProgress, ListItem, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

export const MigrateListItemLayout: FC<{
  enabled: boolean;
  completed: boolean;
  label: string;
  icon?: ReactNode;
  data: { count: number; totalCount: number } | undefined;
}> = ({ enabled, completed, label, icon, data }) => {
  return (
    <ListItem
      secondaryAction={
        data && (
          <Typography color="text.secondary">
            {Math.min(data.count, data.totalCount)}/{data.totalCount} imported
          </Typography>
        )
      }
    >
      <Stack direction="row" spacing={1} alignItems="center" display="flex">
        {!enabled ? (
          <CheckBoxOutlineBlank color="disabled" />
        ) : completed ? (
          <CheckBox color="success" />
        ) : icon ? (
          icon
        ) : (
          <CircularProgress size={24} />
        )}
        <Typography>{label}</Typography>
      </Stack>
    </ListItem>
  );
};
