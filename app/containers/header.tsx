import { Link, useSubmit } from "@remix-run/react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  useTheme,
} from "@mui/material";
import type { FC, MouseEvent } from "react";
import { useId } from "react";
import { useState } from "react";
import { config } from "~/config";
import { paths } from "~/paths";
import { GuildIcon } from "~/components/guildIcon";
import MenuIcon from "@mui/icons-material/Menu";
import { useUsername } from "~/utils";
import { UnderlineText } from "~/components/linkText";
import { drawerWidthOpen } from "./sidebar";

export const Header: FC<{
  onToggleSidebar: () => void;
}> = ({ onToggleSidebar: onToggleDrawer }) => {
  const submit = useSubmit();
  const theme = useTheme();
  const username = useUsername();
  const [settingsMenuAnchor, setSettingsMenuAnchor] =
    useState<null | HTMLElement>(null);
  const settingsButtonId = useId();
  const settingsMenuId = useId();
  const settingsMenuIsOpen = Boolean(settingsMenuAnchor);

  const handleOpenSettingsMenu = (event: MouseEvent<HTMLButtonElement>) =>
    setSettingsMenuAnchor(event.currentTarget);

  const handleLogout = () => {
    handleClose();
    submit(null, { method: "post", action: paths.logout() });
  };

  const handleClose = () => setSettingsMenuAnchor(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        marginTop: 0.5,
        backgroundColor: theme.palette.background.default,
        backgroundImage: "none",
        boxShadow: "none",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar disableGutters>
        <Box
          display="flex"
          justifyContent="space-between"
          width={drawerWidthOpen}
        >
          <Box
            display="flex"
            alignItems="center"
            ml={1}
            component={Link}
            to={paths.dashboard()}
            overflow="hidden"
            sx={{ textDecoration: "none" }}
          >
            <IconButton sx={{ marginRight: 1 }}>
              <GuildIcon bgcolor={theme.palette.primary.light} />
            </IconButton>
            <UnderlineText
              color={theme.palette.primary.light}
              variant="h6"
              noWrap
              hideUnderline
            >
              {config.guildName} DKP
            </UnderlineText>
          </Box>
          <Box alignSelf="center">
            <IconButton sx={{ marginLeft: 1 }} onClick={() => onToggleDrawer()}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          id={settingsButtonId}
          aria-controls={settingsMenuIsOpen ? settingsMenuId : undefined}
          aria-haspopup="true"
          aria-expanded={settingsMenuIsOpen ? "true" : undefined}
          onClick={handleOpenSettingsMenu}
          sx={{ marginRight: 1 }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
            }}
            alt={`${username} Settings`}
          >
            {username[0]}
          </Avatar>
        </IconButton>
        <Menu
          id={settingsMenuId}
          anchorEl={settingsMenuAnchor}
          open={settingsMenuIsOpen}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": settingsButtonId,
          }}
        >
          <MenuItem dense divider disabled>
            {username}
          </MenuItem>
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
