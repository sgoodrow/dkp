import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const AdminRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout>{children}</HeaderLayout>;
};
