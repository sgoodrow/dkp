"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";
import { ReactNode, useState } from "react";

export const ActionCard: FCWithChildren<{
  Icon: SvgIconComponent;
  label: string;
  description: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
}> = ({
  Icon,
  label,
  description,
  onClick,
  disabled,
  loading,
  autoFocus,
  children,
}) => {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <Card raised={focused || hovered}>
      <CardActionArea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onClick()}
        disabled={disabled}
        autoFocus={autoFocus}
      >
        <CardContent component={Stack} spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon />
            <Typography>{label}</Typography>
          </Stack>
          <Divider />
          <Typography variant="body2" color="text.secondary" component="div">
            {description}
          </Typography>
        </CardContent>
        <LinearProgress sx={{ visibility: loading ? "visible" : "hidden" }} />
      </CardActionArea>
      {children}
    </Card>
  );
};
