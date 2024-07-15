"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { SignOutIconButton } from "@/ui/auth/buttons/SignOutIconButton";
import {
  SideBarIconButton,
  SidebarItem,
} from "@/ui/navigation/buttons/SidebarIconButton";
import { ThemeModeIconButton } from "@/ui/navigation/buttons/ThemeModeIconButton";
import { WelcomeDialogIconButton } from "@/ui/navigation/buttons/WelcomeDialogIconButton";
import { AppIcon } from "@/ui/shared/components/static/AppIcon";
import { Box, Divider, Drawer, Paper, Stack } from "@mui/material";

const SIDEBAR_WIDTH = "56px";

export const SidebarPane: FCWithChildren<{}> = ({ children }) => {
  const isAdmin = true;
  const items: SidebarItem[] = [
    uiRoutes.home,
    uiRoutes.players,
    uiRoutes.raids,
    uiRoutes.items,
    uiRoutes.adjustments,
    uiRoutes.leaderboard,
  ];
  if (isAdmin) {
    items.push(uiRoutes.admin);
  }
  return (
    <>
      <Drawer open variant="permanent">
        <Stack direction="row" height={1}>
          <Stack direction="column" spacing={1} p={1} component={Paper}>
            <AppIcon />
            {items.map((i) => (
              <SideBarIconButton key={i.name} item={i} />
            ))}
            <Box flexGrow={1} />
            <Divider />
            <WelcomeDialogIconButton />
            <ThemeModeIconButton />
            {/* todo: move this into the header */}
            <SignOutIconButton />
          </Stack>
        </Stack>
      </Drawer>
      <Box ml={SIDEBAR_WIDTH}>{children}</Box>
    </>
  );
};
