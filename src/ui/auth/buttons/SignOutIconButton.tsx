"use client";

import { signOut } from "next-auth/react";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Logout } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import { FC } from "react";

export const SignOutIconButton: FC = () => {
  return (
    <Tooltip title="Sign out." placement="right">
      <Box display="flex" justifyContent="center">
        <IconButton
          onClick={() => signOut()}
          data-monitoring-id={monitoringIds.SIGN_OUT}
        >
          <Logout />
        </IconButton>
      </Box>
    </Tooltip>
  );
};
