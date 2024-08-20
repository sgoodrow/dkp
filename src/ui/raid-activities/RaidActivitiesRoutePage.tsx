import { uiRoutes } from "@/app/uiRoutes";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";
import { RaidActivitiesTable } from "@/ui/raid-activities/tables/RaidActivitiesTable";

export const RaidActivitiesRoutePage = () => {
  return (
    <HeaderLayout uiRoute={uiRoutes.raidActivities}>
      <RaidActivitiesTable />
    </HeaderLayout>
  );
};
