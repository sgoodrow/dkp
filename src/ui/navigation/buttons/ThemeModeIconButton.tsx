"use client";

import { DarkMode, LightMode, SettingsBrightness } from "@mui/icons-material";
import {
  Box,
  Popover,
  SvgIconProps,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useColorScheme,
  useTheme,
} from "@mui/material";
import type { Mode } from "@mui/system/cssVars/useCurrentColorScheme";
import { FC, useState } from "react";
import {
  MonitoringId,
  monitoringIds,
} from "@/ui/shared/constants/monitoringIds";

export const ThemeModeIconButton: FC = () => {
  const { mode = "system", setMode } = useColorScheme();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const CurrentIcon = theme.palette.mode === "dark" ? DarkMode : LightMode;

  return (
    <>
      <Tooltip title="Change theme." placement="right">
        <ToggleButton
          data-monitoring-id={monitoringIds.TOGGLE_SETTINGS_OPEN}
          value="check"
          onClick={handleClick}
          selected={Boolean(anchorEl)}
          color={Boolean(anchorEl) ? "primary" : undefined}
        >
          <CurrentIcon />
        </ToggleButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: -20,
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => setMode(newMode)}
          aria-label="Theme mode buttons"
          size="small"
        >
          <ThemeModeButton
            text="Light"
            tooltip="Use light mode."
            value="light"
            dataMonitoringId={monitoringIds.TOGGLE_LIGHT_MODE_THEME}
            Icon={LightMode}
          />
          <ThemeModeButton
            text="System"
            tooltip="Use system preferences to select theme."
            value="system"
            dataMonitoringId={monitoringIds.TOGGLE_SYSTEM_MODE_THEME}
            Icon={SettingsBrightness}
          />
          <ThemeModeButton
            text="Dark"
            tooltip="Use dark mode."
            value="dark"
            dataMonitoringId={monitoringIds.TOGGLE_DARK_MODE_THEME}
            Icon={DarkMode}
          />
        </ToggleButtonGroup>
      </Popover>
    </>
  );
};

const ThemeModeButton: FC<{
  text: string;
  tooltip: string;
  value: Mode;
  Icon: FC<SvgIconProps>;
  dataMonitoringId: MonitoringId;
}> = ({ text, tooltip, value, Icon, dataMonitoringId }) => {
  return (
    <Tooltip title={tooltip}>
      <ToggleButton value={value} data-monitoring-id={dataMonitoringId}>
        <Box mx={1} display="flex" alignItems="center">
          <Icon fontSize="small" sx={{ mr: 1 }} />
          {text}
        </Box>
      </ToggleButton>
    </Tooltip>
  );
};
