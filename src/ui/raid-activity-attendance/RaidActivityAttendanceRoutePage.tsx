import { RaidActivityAttendanceTable } from "@/ui/raid-activity-attendance/tables/RaidActivityAttendanceTable";
import { FC } from "react";

export const RaidActivityAttendanceRoutePage: FC<{ id: number }> = ({ id }) => {
  return (
    <>
      <RaidActivityAttendanceTable id={id} />
    </>
  );
};
