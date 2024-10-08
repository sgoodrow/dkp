"use client";

import { FC } from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { TypographyProps } from "@mui/material";

export const CharacterLink: FC<{
  character: {
    id: number;
    name: string;
    defaultPilotId: string | null;
  };
  variant?: TypographyProps["variant"];
}> = ({ character, variant }) => {
  return (
    <SiteLink
      variant={variant}
      data-monitoring-id={monitoringIds.GOTO_CHARACTER}
      href={
        character?.defaultPilotId
          ? uiRoutes.character.href({
              userId: character.defaultPilotId,
              characterId: character.id,
            })
          : ""
      }
      label={character.name}
      startIcon={
        character.defaultPilotId === null ? (
          <uiRoutes.bots.icon
            fontSize="small"
            sx={{ verticalAlign: "sub", marginRight: 0.5 }}
          />
        ) : null
      }
    />
  );
};
