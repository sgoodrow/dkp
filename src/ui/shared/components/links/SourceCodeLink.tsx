import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { app } from "@/shared/constants/app";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { FC } from "react";

export const SourceCodeLink: FC<{}> = ({}) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_SOURCE_CODE}
      label={app.sourceCodeHost}
      href={app.sourceCodeUrl}
    />
  );
};
