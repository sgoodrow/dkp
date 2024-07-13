"use client";

import { signIn } from "next-auth/react";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { Button } from "@mui/material";
import { FC, ReactNode } from "react";
import { uiRoutes } from "@/app/uiRoutes";

export const SignInWithProviderButton: FC<{
  providerTitle: string;
  providerName: string;
  monitoringId: MonitoringId;
  providerIcon: ReactNode;
}> = ({ providerTitle, providerName, providerIcon, monitoringId }) => {
  return (
    <Button
      startIcon={providerIcon}
      data-monitoring-id={monitoringId}
      color="primary"
      variant="contained"
      onClick={() =>
        signIn(providerName, { redirectTo: uiRoutes.private.home.href() })
      }
    >
      Sign in with {providerTitle}
    </Button>
  );
};
