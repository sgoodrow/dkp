import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const RaidsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout uiRoute={uiRoutes.raids}>{children}</HeaderLayout>;
};
