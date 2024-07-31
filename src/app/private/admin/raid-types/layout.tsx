import React from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import { RaidActivityTypesRouteLayout } from "@/ui/raid-activity-types/RaidActivityTypesRouteLayout";

export const generateMetadata = async (
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  return generateMetadataTitle(uiRoutes.raidActivityTypes.name, parent);
};

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <RaidActivityTypesRouteLayout>{children}</RaidActivityTypesRouteLayout>
  );
}
