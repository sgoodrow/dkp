import { raidActivityController } from "@/api/controllers/raidActivityController";
import { uiRoutes } from "@/app/uiRoutes";
import { RaidActivityRouteLayout } from "@/ui/raid-activity/RaidActivityRouteLayout";
import { generateMetadataTitle } from "@/ui/shared/utils/generateMetadataTitle";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

export const generateMetadata = async (
  props: {
    params: {
      id: string;
    };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const id = Number(props.params.id);
  const raidActivity = await raidActivityController().get({
    id,
  });
  return generateMetadataTitle(
    uiRoutes.raidActivity.name(raidActivity),
    parent,
  );
};

const Layout: FCWithChildren<{ params: { id: string } }> = ({
  params,
  children,
}) => {
  const id = Number(params.id);
  return <RaidActivityRouteLayout id={id}>{children}</RaidActivityRouteLayout>;
};

export default Layout;
