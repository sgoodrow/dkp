import { CreateCharacterDialogButton } from "@/ui/players/buttons/CreateCharacterDialogButton";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { SupportLink } from "@/ui/shared/components/links/SupportLink";
import { Divider, Stack, Typography } from "@mui/material";
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
      <Stack spacing={2} height={cardWithTableHeight}>
        <MyCharactersTable />
        <Divider />
        <Typography color="text.secondary" variant="body2">
          Something wrong? Go to <SupportLink />
        </Typography>
      </Stack>
    </LabeledCard>
  );
};
