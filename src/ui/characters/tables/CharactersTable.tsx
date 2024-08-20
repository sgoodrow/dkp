"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { FC } from "react";
import { InfiniteTable } from "@/ui/shared/components/tables/InfiniteTable";
import { getCharacterClassColumn } from "@/ui/characters/tables/getCharacterClassColumn";
import { getCharacterRaceColumn } from "@/ui/characters/tables/getCharacterRaceColumn";
import { getCharacterNameColumn } from "@/ui/characters/tables/getCharacterNameColumn";

export const CharactersTable: FC<{ userId?: string }> = ({ userId }) => {
  const utils = trpc.useUtils();
  return (
    <InfiniteTable
      getRows={(options) =>
        utils.character.getManyByUserId.fetch({ ...options, userId })
      }
      columnDefs={[
        getCharacterNameColumn(),
        getCharacterClassColumn(),
        getCharacterRaceColumn(),
      ]}
    />
  );
};
