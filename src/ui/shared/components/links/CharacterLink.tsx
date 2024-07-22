"use client";

import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { useSession } from "next-auth/react";
import { FC } from "react";

export const CharacterLink: FC<{
  characterId: number;
  characterName: string;
}> = ({ characterId, characterName }) => {
  const session = useSession();
  return (
    <SiteLink
      data-monitoring-id={monitoringIds.GOTO_CHARACTER}
      href={
        session.data?.user?.id
          ? uiRoutes.character.href({
              playerId: session.data.user.id,
              characterId,
            })
          : ""
      }
      label={characterName}
    />
  );
};
