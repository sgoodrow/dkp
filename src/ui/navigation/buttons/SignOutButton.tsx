"use client";

import { signOut } from "next-auth/react";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Logout } from "@mui/icons-material";
import { FC } from "react";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";

export const SignOutButton: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <SideBarButton
      name="Sign out"
      icon={<Logout />}
      onClick={() => signOut()}
      dataMonitoringId={monitoringIds.SIGN_OUT}
      hideLabel={isMobile}
    />
  );
};
