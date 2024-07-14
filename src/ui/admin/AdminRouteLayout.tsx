import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const SettingsRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout>{children}</HeaderLayout>;
};
