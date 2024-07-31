import { CreateRaidActivityTypeCard } from "@/ui/raid-activity-types/cards/CreateRaidActivityTypeCard";
import { RaidActivityTypesTable } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { Unstable_Grid2 } from "@mui/material";

export const RaidActivityTypesRoutePage = () => {
  return (
    <>
      <Unstable_Grid2 container spacing={1}>
        <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
          <CreateRaidActivityTypeCard />
        </Unstable_Grid2>
      </Unstable_Grid2>
      <RaidActivityTypesTable />
    </>
  );
};
