import { RaidActivityPurchasesRoutePage } from "@/ui/raid-activity-purchases/RaidActivityPurchasesRoutePage";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle("Purchases", parent);
};

const Page: FC<{ params: { id: string } }> = ({ params }) => {
  return <RaidActivityPurchasesRoutePage id={Number(params.id)} />;
};

export default Page;
