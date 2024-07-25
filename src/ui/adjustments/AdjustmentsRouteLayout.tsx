import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const AdjustmentsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout uiRoute={uiRoutes.adjustments}>{children}</HeaderLayout>;
};
