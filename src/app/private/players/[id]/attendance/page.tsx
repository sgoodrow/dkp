import { PlayerAttendanceRoutePage } from "@/ui/player-attendance/PlayerAttendanceRoutePage";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle("Attendance", parent);
};

const Page: FC<{ params: { id: string } }> = ({ params }) => {
  return <PlayerAttendanceRoutePage id={params.id} />;
};

export default Page;
