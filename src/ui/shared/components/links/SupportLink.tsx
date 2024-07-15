import { discord } from "@/shared/constants/urls";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import {
  SUPPORT_DISCORD_CHANNEL_ID,
  SUPPORT_DISCORD_CHANNEL_NAME,
  GUILD_DISCORD_SERVER_ID,
} from "@/ui/shared/components/static/copy";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { FC } from "react";

export const SupportLink: FC<{}> = ({}) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_DISCORD_SUPPORT}
      label={`#${SUPPORT_DISCORD_CHANNEL_NAME}`}
      href={discord.channelUrl({
        guildId: GUILD_DISCORD_SERVER_ID,
        channelId: SUPPORT_DISCORD_CHANNEL_ID,
      })}
    />
  );
};
