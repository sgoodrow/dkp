import { guild } from "@/shared/constants/guild";
import { discord } from "@/shared/constants/urls";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { FC } from "react";

export const SupportLink: FC<{}> = ({}) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_DISCORD_SUPPORT}
      label={`#${guild.supportDiscordChannelName}`}
      href={discord.channelUrl({
        guildId: guild.discordServerId,
        channelId: guild.supportDiscordChannelId,
      })}
    />
  );
};
