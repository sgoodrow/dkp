import { PlayerAdjustmentsRoutePage } from "@/ui/player-adjustments/PlayerAdjustmentsRoutePage";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle("Adjustments", parent);
};

const Page: FC<{ params: { id: string } }> = ({ params }) => {
  return <PlayerAdjustmentsRoutePage id={params.id} />;
};

export default Page;
