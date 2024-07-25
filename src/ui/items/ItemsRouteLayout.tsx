import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const ItemsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout uiRoute={uiRoutes.items}>{children}</HeaderLayout>;
};
