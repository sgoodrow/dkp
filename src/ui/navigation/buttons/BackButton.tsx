import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { ArrowBack } from "@mui/icons-material";
import { FC } from "react";

export const BackButton: FC<{
  href: string;
  hideLabel: boolean;
  ["data-monitoring-id"]: MonitoringId;
}> = ({ href, ["data-monitoring-id"]: dataMonitoringId, hideLabel }) => {
  return (
    <SideBarButton
      label="Back"
      icon={<ArrowBack />}
      dataMonitoringId={dataMonitoringId}
      href={href}
      hideLabel={hideLabel}
    />
  );
};
