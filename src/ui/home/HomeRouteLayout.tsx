import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const HomeRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout>{children}</HeaderLayout>;
};
