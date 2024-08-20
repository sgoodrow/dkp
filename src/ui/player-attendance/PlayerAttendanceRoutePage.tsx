import { PlayerAttendanceTable } from "@/ui/player-attendance/tables/PlayerAttendanceTable";
import { FC } from "react";

export const PlayerAttendanceRoutePage: FC<{ id: string }> = ({ id }) => {
  return (
    <>
      <PlayerAttendanceTable id={id} />
    </>
  );
};
