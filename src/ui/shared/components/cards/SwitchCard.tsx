"use client";

import { FC, ReactNode, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

export const SwitchCard: FC<{
  label: string;
  description: ReactNode;
  checked: boolean;
  onClick: (newValue: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
}> = ({
  label,
  description,
  checked,
  disabled,
  loading,
  autoFocus,
  onClick,
}) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <Card raised={focused || hovered}>
      <CardActionArea
        onClick={() => onClick(!checked)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={disabled}
        autoFocus={autoFocus}
      >
        <CardContent component={Stack} spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch checked={checked} size="small" />
            <Typography>{label}</Typography>
          </Stack>
          <Divider />
          <Typography variant="body2" color="text.secondary" component="div">
            {description}
          </Typography>
        </CardContent>
        <LinearProgress sx={{ visibility: loading ? "visible" : "hidden" }} />
      </CardActionArea>
    </Card>
  );
};
