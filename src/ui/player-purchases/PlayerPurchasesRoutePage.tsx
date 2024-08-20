import { PlayerPurchasesTable } from "@/ui/player-purchases/tables/PlayerPurchasesTable";
import { FC } from "react";

export const PlayerPurchasesRoutePage: FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <PlayerPurchasesTable id={id} />
    </>
  );
};
