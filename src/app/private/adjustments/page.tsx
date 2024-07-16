import { AdjustmentsRoutePage } from "@/ui/adjustments/AdjustmentsRoutePage";
import { uiRoutes } from "@/app/uiRoutes";
import { Metadata, ResolvingMetadata } from "next";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.adjustments.name, parent);
};

export default function Page() {
  return <AdjustmentsRoutePage />;
}
