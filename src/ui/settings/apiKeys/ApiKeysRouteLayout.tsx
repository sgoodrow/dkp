import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";
import { Breadcrumb } from "@/ui/shared/components/navigation/Breadcrumb";
import { Breadcrumbs } from "@mui/material";

export const ApiKeysRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb
            label={uiRoutes.private.apiKeys.name}
            Icon={uiRoutes.private.apiKeys.icon}
            href={uiRoutes.private.apiKeys.href()}
            dataMonitoringId={uiRoutes.private.apiKeys.dataMonitoringId}
          />
        </Breadcrumbs>
      }
    >
      {children}
    </HeaderLayout>
  );
};
