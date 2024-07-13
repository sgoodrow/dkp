import { ApiKeysRouteLayout } from "@/ui/settings/apiKeys/ApiKeysRouteLayout";
import React from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.private.settings.apiKeys.name, parent);
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <ApiKeysRouteLayout>{children}</ApiKeysRouteLayout>;
}
