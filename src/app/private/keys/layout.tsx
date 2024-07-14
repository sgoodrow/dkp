import React from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { ApiKeysRouteLayout } from "@/ui/apiKeys/ApiKeysRouteLayout";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.apiKeys.name, parent);
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <ApiKeysRouteLayout>{children}</ApiKeysRouteLayout>;
}
