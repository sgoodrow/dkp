import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const RaidActivityTypesRouteLayout: FCWithChildren<{}> = ({
  children,
}) => {
  return (
    <HeaderLayout uiRoute={uiRoutes.raidActivityTypes}>{children}</HeaderLayout>
  );
};
