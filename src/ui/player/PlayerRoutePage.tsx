import { CharactersTable } from "@/ui/characters/tables/CharactersTable";
import { PlayerSummaryCard } from "@/ui/player/cards/PlayerSummaryCard";
import { Unstable_Grid2 } from "@mui/material";
import { FC } from "react";

export const PlayerRoutePage: FC<{ id: string }> = ({ id }) => {
  return (
    <Unstable_Grid2 container width={1} spacing={1}>
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={4}>
        <PlayerSummaryCard id={id} />
      </Unstable_Grid2>
      <Unstable_Grid2 xs={12} display="flex" minHeight={400}>
        <CharactersTable userId={id} />
      </Unstable_Grid2>
    </Unstable_Grid2>
  );
};
