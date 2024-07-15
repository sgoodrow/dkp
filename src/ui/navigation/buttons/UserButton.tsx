"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { AccountCircle } from "@mui/icons-material";
import { Badge, Box, Skeleton, useTheme } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

const PROFILE_IMAGE_SIZE = 24;

export const UserButton: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { data } = trpc.user.get.useQuery();
  const route = uiRoutes.player;
  const theme = useTheme();
  return (
    <Badge badgeContent={data?.currentDkp} color="error" max={data?.currentDkp}>
      <SideBarButton
        dataMonitoringId={route.dataMonitoringId}
        href={route.href(data?.id || "")}
        name={data?.name || <Skeleton />}
        icon={
          data === undefined ? (
            <Skeleton
              variant="circular"
              width={PROFILE_IMAGE_SIZE}
              height={PROFILE_IMAGE_SIZE}
            />
          ) : data.image === null ? (
            <AccountCircle
              sx={{ width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE }}
            />
          ) : (
            <Image
              style={{
                borderRadius: theme.shape.borderRadius,
                overflow: "hidden",
              }}
              src={data.image}
              alt="User"
              width={PROFILE_IMAGE_SIZE}
              height={PROFILE_IMAGE_SIZE}
            />
          )
        }
        isMobile={isMobile}
      />
    </Badge>
  );
};
