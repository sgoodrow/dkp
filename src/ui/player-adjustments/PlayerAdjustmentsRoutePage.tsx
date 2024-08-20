import { PlayerAdjustmentsTable } from "@/ui/player-adjustments/tables/PlayerAdjustmentsTable";
import { FC } from "react";

export const PlayerAdjustmentsRoutePage: FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <PlayerAdjustmentsTable id={id} />
    </>
  );
};
