import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";

export const PlayersRouteLayout: FCWithChildren<{}> = ({ children }) => {
  return <HeaderLayout>{children}</HeaderLayout>;
};
