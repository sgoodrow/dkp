import { userController } from "@/api/controllers/userController";
import { uiRoutes } from "@/app/uiRoutes";
import { PlayerRouteLayout } from "@/ui/player/PlayerRouteLayout";
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
  const id = props.params.id;
  const { displayName } = await userController().get({
    id: id,
  });
  return generateMetadataTitle(uiRoutes.player.name(displayName), parent);
};

const Layout: FCWithChildren<{ params: { id: string } }> = ({
  params,
  children,
}) => {
  return <PlayerRouteLayout id={params.id}>{children}</PlayerRouteLayout>;
};

export default Layout;
