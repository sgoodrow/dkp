import { RaidActivityAdjustmentsTable } from "@/ui/raid-activity-adjustments/tables/RaidActivityAdjustmentsTable";
import { FC } from "react";

export const RaidActivityAdjustmentsRoutePage: FC<{ id: number }> = ({
  id,
}) => {
  return (
    <>
      <RaidActivityAdjustmentsTable id={id} />
    </>
  );
};
