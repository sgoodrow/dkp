import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const TransactionsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout uiRoute={uiRoutes.transactions}>{children}</HeaderLayout>
  );
};
