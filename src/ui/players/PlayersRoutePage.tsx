import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";
import { PlayersTable } from "@/ui/players/tables/PlayersTable";

export const PlayersRoutePage = () => {
  return (
    <HeaderLayout uiRoute={uiRoutes.players}>
      <PlayersTable />
    </HeaderLayout>
  );
};
