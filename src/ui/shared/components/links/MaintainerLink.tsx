import { discord } from "@/shared/constants/urls";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import {
  MAINTAINER_NAME,
  MAINTAINER_DISCORD_USER_ID,
} from "@/ui/shared/components/static/copy";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { FC } from "react";

export const MaintainerLink: FC<{}> = ({}) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_DISCORD_MAINTAINER}
      label={MAINTAINER_NAME}
      href={discord.userUrl({ userId: MAINTAINER_DISCORD_USER_ID })}
    />
  );
};
