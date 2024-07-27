import React from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { BotsRouteLayout } from "@/ui/bots/BotsRouteLayout";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.bots.name, parent);
};

export default function Layout({ children }: React.PropsWithChildren) {
  return <BotsRouteLayout>{children}</BotsRouteLayout>;
}
