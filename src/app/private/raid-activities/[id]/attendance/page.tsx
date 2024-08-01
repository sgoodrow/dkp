import { RaidActivityAttendanceRoutePage } from "@/ui/raid-activity-attendance/RaidActivityAttendanceRoutePage";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle("Attendance", parent);
};

export default function Page() {
  return <RaidActivityAttendanceRoutePage />;
}
