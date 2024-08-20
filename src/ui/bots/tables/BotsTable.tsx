"use client";

import { FC } from "react";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { getCharacterCreatedAtColumn } from "@/ui/characters/tables/getCharacterCreatedAtColumn";
import { getCharacterNameColumn } from "@/ui/characters/tables/getCharacterNameColumn";
import { getCharacterClassColumn } from "@/ui/characters/tables/getCharacterClassColumn";
import { getCharacterRaceColumn } from "@/ui/characters/tables/getCharacterRaceColumn";

export const BotsTable: FC<{}> = ({}) => {
  const utils = trpc.useUtils();

  return (
    <InfiniteTable
      rowHeight={64}
      getRows={utils.character.getManyWithoutDefaultPilot.fetch}
      columnDefs={[
        getCharacterNameColumn(),
        getCharacterClassColumn(),
        getCharacterRaceColumn(),
        getCharacterCreatedAtColumn(),
      ]}
    />
  );
};
