import { CreateCharacterDialogButton } from "@/ui/players/buttons/CreateCharacterDialogButton";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Stack } from "@mui/material";
import { FC } from "react";
import { MyCharactersTable } from "@/ui/characters/tables/MyCharactersTable";
import { cardWithTableHeight } from "@/ui/shared/constants/sizes";

export const MyCharactersCard: FC<{}> = ({}) => {
  return (
    <LabeledCard
      title="My Characters"
      labelId="my-characters-grid-card"
      titleBar={<CreateCharacterDialogButton />}
    >
      <Stack height={cardWithTableHeight}>
        <MyCharactersTable />
      </Stack>
    </LabeledCard>
  );
};
