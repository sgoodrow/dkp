import { FC } from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";

export const RaidActivityLink: FC<{
  raidActivity: {
    id: number;
    type: {
      name: string;
    };
  };
}> = ({ raidActivity }) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_RAID_ACTIVITY_ATTENDANCE}
      label={raidActivity.type.name}
      href={uiRoutes.raidActivity.href(raidActivity?.id)}
    />
  );
};
