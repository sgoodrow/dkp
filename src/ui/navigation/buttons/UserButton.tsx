"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { AccountCircle, Star } from "@mui/icons-material";
import { Badge, Box, Popper, Skeleton, useTheme } from "@mui/material";
import Image from "next/image";
import { FC, useRef } from "react";

const PROFILE_IMAGE_SIZE = 24;

export const UserButton: FC<{ hideLabel: boolean }> = ({ hideLabel }) => {
  const anchorEl = useRef<HTMLDivElement>(null);
  const { data } = trpc.user.get.useQuery();
  const route = uiRoutes.player;
  const theme = useTheme();
  return (
    <>
      <Box ref={anchorEl}>
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
                }}
                src={data.image}
                alt="User avatar"
                width={PROFILE_IMAGE_SIZE}
                height={PROFILE_IMAGE_SIZE}
              />
            )
          }
          hideLabel={hideLabel}
        />
      </Box>
      <Popper
        open={!!anchorEl.current}
        anchorEl={anchorEl.current}
        placement="right-start"
        sx={{ zIndex: 10000 }}
      >
        <Badge
          badgeContent={data?.currentDkp}
          color="error"
          showZero
          max={data?.currentDkp}
        />
      </Popper>
    </>
  );
};
