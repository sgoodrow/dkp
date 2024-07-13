import { HomeRoutePage } from "@/ui/home/HomeRoutePage";

import { uiRoutes } from "@/app/uiRoutes";
import { Metadata, ResolvingMetadata } from "next";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.private.home.name, parent);
};

export default function Page() {
  return <HomeRoutePage />;
}
