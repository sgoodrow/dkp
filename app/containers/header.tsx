import { Form, Link } from "@remix-run/react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import type { FC, MouseEvent } from "react";
import { useState } from "react";
import { config } from "~/config";
import { paths } from "~/paths";
import { GuildIcon } from "~/components/guildIcon";
import { drawerWidth } from "./navigation";
import MenuIcon from "@mui/icons-material/Menu";

export const Header: FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ alignItems: "center" }}>
        <Box display="flex" justifyContent="space-between" width={drawerWidth}>
          <Link to={paths.dashboard()} style={{ textDecoration: "none" }}>
            <Box display="flex" alignItems="center">
              <GuildIcon bgcolor={theme.palette.primary.light} />
              <Box ml={1} />
              <Typography color={theme.palette.primary.light} variant="h6">
                {config.guildName} DKP
              </Typography>
            </Box>
          </Link>
          <IconButton>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Settings
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
