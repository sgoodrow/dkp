import type { CSSObject, Theme } from "@mui/material";
import { Divider } from "@mui/material";
import { Box } from "@mui/material";
import { alpha } from "@mui/material";
import { useTheme } from "@mui/material";
import { Tooltip } from "@mui/material";
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MultipleStopIcon from "@mui/icons-material/MultipleStop";
import FestivalIcon from "@mui/icons-material/Festival";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { FC, ReactNode } from "react";
import type { NavLinkProps } from "@remix-run/react";
import { NavLink } from "@remix-run/react";
import { paths } from "~/paths";
import type { SvgIconComponent } from "@mui/icons-material";
import { theme } from "~/theme";

const itemIconWidth = "32px";
const drawerWidthClosed = `calc(${theme.spacing(2)} + ${itemIconWidth})`;
export const drawerWidthOpen = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.background.default,
  border: 0,
  width: drawerWidthOpen,
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.background.default,
  border: 0,
  width: drawerWidthClosed,
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidthOpen,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SidebarGroup: FC<{
  name: string;
  children: ReactNode;
  isOpen: boolean;
}> = ({ isOpen, name, children }) => (
  <>
    {isOpen && (
      <ListItem dense>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            variant: "subtitle1",
            fontWeight: "bold",
          }}
        />
      </ListItem>
    )}
    {children}
    {isOpen && <Divider sx={{ my: 1 }} />}
  </>
);

const SidebarItem: FC<{
  isOpen: boolean;
  text: string;
  tooltip?: string;
  Icon: SvgIconComponent;
  to: NavLinkProps["to"];
}> = ({ isOpen, text, tooltip, to, Icon }) => {
  const theme = useTheme();
  return (
    <Tooltip
      title={isOpen ? undefined : tooltip || text}
      arrow
      placement="right"
    >
      <NavLink
        to={to}
        style={{
          textDecoration: "none",
          color: theme.palette.text.primary,
        }}
      >
        {({ isActive }) => (
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                bgcolor: isActive
                  ? alpha(
                      theme.palette.action.active,
                      theme.palette.action.hoverOpacity
                    )
                  : undefined,
                borderRadius: theme.shape.borderRadius * 0.25,
                padding: 0.5,
                paddingLeft: isOpen ? 3 : 0.5,
              }}
            >
              <ListItemIcon sx={{ fontSize: itemIconWidth }}>
                <Icon fontSize="inherit" />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  sx={{
                    margin: 0,
                  }}
                  primary={text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : undefined,
                    variant: "subtitle2",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        )}
      </NavLink>
    </Tooltip>
  );
};

interface SidebarItemGroupData {
  name: string;
  items: SidebarItemData[];
}

interface SidebarItemData {
  text: string;
  tooltip?: string;
  to: NavLinkProps["to"];
  Icon: SvgIconComponent;
}

const sidebarGroups: SidebarItemGroupData[] = [
  {
    name: "Dashboard",
    items: [
      {
        text: "Characters",
        tooltip: "My Characters",
        to: paths.dashboardCharacters(),
        Icon: SupervisorAccountIcon,
      },
      {
        text: "Attendance",
        tooltip: "My Attendance",
        to: paths.dashboardAttendance(),
        Icon: EventAvailableIcon,
      },
      {
        text: "Transactions",
        tooltip: "My Transactions",
        to: paths.dashboardTransactions(),
        Icon: MultipleStopIcon,
      },
    ],
  },
  {
    name: "Activities",
    items: [
      {
        text: "Raids",
        to: paths.activityRaids(),
        Icon: FestivalIcon,
      },
      {
        text: "Transactions",
        tooltip: "All Transactions",
        to: paths.activityTransactions(),
        Icon: EmojiEventsIcon,
      },
    ],
  },
];

export const Sidebar: FC<{
  isOpen: boolean;
  children?: ReactNode;
}> = ({ isOpen }) => (
  <Drawer variant="permanent" open={isOpen}>
    <Toolbar />
    <List
      sx={{
        mt: 1,
        padding: 0,
      }}
    >
      <Box ml={1}>
        {sidebarGroups.map((group, g) => (
          <SidebarGroup name={group.name} key={group.name} isOpen={isOpen}>
            <>
              {group.items.map((item, i) => (
                <>
                  <SidebarItem
                    isOpen={isOpen}
                    key={item.text}
                    text={item.text}
                    tooltip={item.tooltip}
                    to={item.to}
                    Icon={item.Icon}
                  />
                  {i < group.items.length && <Box mt={1} />}
                </>
              ))}
              {g < sidebarGroups.length && <Box mt={1} />}
            </>
          </SidebarGroup>
        ))}
      </Box>
    </List>
  </Drawer>
);
