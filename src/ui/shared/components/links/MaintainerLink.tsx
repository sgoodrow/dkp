import { discord } from "@/shared/constants/urls";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { app } from "@/shared/constants/app";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { FC } from "react";

export const MaintainerLink: FC<{}> = ({}) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_DISCORD_MAINTAINER}
      label={app.maintainerName}
      href={discord.userUrl({ userId: app.maintainerDiscordUserId })}
    />
  );
};
