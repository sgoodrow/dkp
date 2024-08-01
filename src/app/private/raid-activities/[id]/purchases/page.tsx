import { RaidActivityPurchasesRoutePage } from "@/ui/raid-activity-purchases/RaidActivityPurchasesRoutePage";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle("Purchases", parent);
};

export default function Page() {
  return <RaidActivityPurchasesRoutePage />;
}
