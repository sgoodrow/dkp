import { PlayerPurchasesRoutePage } from "@/ui/player-purchases/PlayerPurchasesRoutePage";
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
  return <PlayerPurchasesRoutePage id={params.id} />;
};

export default Page;
