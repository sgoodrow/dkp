import { CreateCharacterDialogButton } from "@/ui/players/buttons/CreateCharacterDialogButton";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Stack } from "@mui/material";
import { FC } from "react";
import { CharactersTable } from "@/ui/characters/tables/CharactersTable";
import { cardWithTableHeight } from "@/ui/shared/constants/sizes";

export const MyCharactersCard: FC<{ userId?: string }> = ({ userId }) => {
  return (
    <LabeledCard
      title="My Characters"
      labelId="my-characters-grid-card"
      titleBar={<CreateCharacterDialogButton />}
    >
      <Stack height={cardWithTableHeight}>
        <CharactersTable userId={userId} />
      </Stack>
    </LabeledCard>
  );
};
