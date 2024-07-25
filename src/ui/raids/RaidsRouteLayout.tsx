import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const RaidsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout
      title={uiRoutes.raids.name}
      subtitle={uiRoutes.raids.description}
    >
      {children}
    </HeaderLayout>
  );
};
