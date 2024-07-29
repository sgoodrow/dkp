"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Skeleton } from "@mui/material";
import { FC } from "react";

export const PlayerLink: FC<{
  user?: {
    id: string;
    displayName: string;
    discordMetadata: {
      roleIds: string[];
    } | null;
  };
  inheritSize?: boolean;
}> = ({ user, inheritSize }) => {
  const { data: role } = trpc.discord.getBestRole.useQuery(
    {
      roleIds: user?.discordMetadata?.roleIds || [],
    },
    {
      enabled: !!user,
    },
  );
  return (
    <SiteLink
      inheritSize={inheritSize}
      data-monitoring-id={monitoringIds.GOTO_PLAYER}
      href={
        user
          ? uiRoutes.player.href({
              userId: user.id,
            })
          : ""
      }
      label={user?.displayName || <Skeleton />}
      color={role?.color || undefined}
    />
  );
};
