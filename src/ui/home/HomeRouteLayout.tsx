import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";
import { Breadcrumb } from "@/ui/shared/components/navigation/Breadcrumb";
import { Breadcrumbs } from "@mui/material";

export const HomeRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb
            label={uiRoutes.private.home.name}
            Icon={uiRoutes.private.home.icon}
            href={uiRoutes.private.home.href()}
            dataMonitoringId={uiRoutes.private.home.dataMonitoringId}
          />
        </Breadcrumbs>
      }
    >
      {children}
    </HeaderLayout>
  );
};
