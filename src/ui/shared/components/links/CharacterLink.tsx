"use client";

import { FC } from "react";
import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { Stack } from "@mui/material";

export const CharacterLink: FC<{
  characterName: string;
}> = ({ characterName }) => {
  const { data: character } = trpc.character.getByNameMatch.useQuery({
    search: characterName,
  });
  return character === null ? (
    <OverflowTooltipTypography color="text.secondary">
      {characterName}
    </OverflowTooltipTypography>
  ) : (
    <Stack direction="row" spacing={1} alignItems="center">
      {character?.defaultPilotId === null ? <uiRoutes.bots.icon /> : null}
      <SiteLink
        data-monitoring-id={monitoringIds.GOTO_CHARACTER}
        href={
          character?.defaultPilotId
            ? uiRoutes.character.href({
                playerId: character.defaultPilotId,
                characterId: character.id,
              })
            : ""
        }
        label={<>{characterName}</>}
      />
    </Stack>
  );
};
