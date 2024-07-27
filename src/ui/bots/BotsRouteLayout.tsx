import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const BotsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout uiRoute={uiRoutes.bots}>{children}</HeaderLayout>;
};
