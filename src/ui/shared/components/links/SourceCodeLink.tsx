import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import {
  SOURCE_CODE_URL,
  SOURCE_CODE_HOST,
} from "@/ui/shared/components/static/copy";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { FC } from "react";

export const SourceCodeLink: FC<{}> = ({}) => {
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_SOURCE_CODE}
      label={SOURCE_CODE_HOST}
      href={SOURCE_CODE_URL}
    />
  );
};
