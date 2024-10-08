"use client";

import { signIn } from "next-auth/react";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { Button } from "@mui/material";
import { FC, ReactNode } from "react";
import { uiRoutes } from "@/app/uiRoutes";

export const SignInWithProviderButton: FC<{
  providerName: string;
  monitoringId: MonitoringId;
  providerIcon: ReactNode;
}> = ({ providerName, providerIcon, monitoringId }) => {
  return (
    <Button
      startIcon={providerIcon}
      data-monitoring-id={monitoringId}
      color="primary"
      variant="contained"
      onClick={() => signIn(providerName, { redirectTo: uiRoutes.home.href() })}
    >
      Sign In
    </Button>
  );
};
