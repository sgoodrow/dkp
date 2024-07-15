import { SideBarButton } from "@/ui/navigation/buttons/SidebarButton";
import { MonitoringId } from "@/ui/shared/constants/monitoringIds";
import { ArrowBack } from "@mui/icons-material";
import { FC } from "react";

export const BackButton: FC<{
  href: string;
  isMobile: boolean;
  ["data-monitoring-id"]: MonitoringId;
}> = ({ href, ["data-monitoring-id"]: dataMonitoringId, isMobile }) => {
  return (
    <SideBarButton
      name="Back"
      icon={<ArrowBack />}
      dataMonitoringId={dataMonitoringId}
      href={href}
      isMobile={isMobile}
    />
  );
};
