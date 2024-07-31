import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const RaidActivitiesRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout uiRoute={uiRoutes.raidActivities}>{children}</HeaderLayout>
  );
};
