import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const ApiKeysRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout uiRoute={uiRoutes.apiKeys}>{children}</HeaderLayout>;
};
