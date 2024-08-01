import { RaidActivityAdjustmentsRoutePage } from "@/ui/raid-activity-adjustments/RaidActivityAdjustmentsRoutePage";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle("Adjustments", parent);
};

export default function Page() {
  return <RaidActivityAdjustmentsRoutePage />;
}
