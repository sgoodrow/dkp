import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";
import { Breadcrumb } from "@/ui/shared/components/navigation/Breadcrumb";
import { Breadcrumbs } from "@mui/material";

export const SettingsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb
            label={uiRoutes.private.settings.name}
            Icon={uiRoutes.private.settings.icon}
            href={uiRoutes.private.settings.href()}
            dataMonitoringId={uiRoutes.private.settings.dataMonitoringId}
          />
        </Breadcrumbs>
      }
    >
      {children}
    </HeaderLayout>
  );
};
