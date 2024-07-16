import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const ItemsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout>{children}</HeaderLayout>;
};
