import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const AdminRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return (
    <HeaderLayout
      title={uiRoutes.admin.name}
      subtitle={uiRoutes.admin.description}
    >
      {children}
    </HeaderLayout>
  );
};
