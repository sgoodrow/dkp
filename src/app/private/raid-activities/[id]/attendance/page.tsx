import { RaidActivityAttendanceRoutePage } from "@/ui/raid-activity-attendance/RaidActivityAttendanceRoutePage";
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
  return <RaidActivityAttendanceRoutePage id={Number(params.id)} />;
};

export default Page;
