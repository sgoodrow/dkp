import { SettingsRoutePage } from "@/ui/settings/SettingsRoutePage";
import { uiRoutes } from "@/app/uiRoutes";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.private.settings.name, parent);
};

export default function Page() {
  return <SettingsRoutePage />;
}
