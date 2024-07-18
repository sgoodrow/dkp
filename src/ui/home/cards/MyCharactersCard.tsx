"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { CreateCharacterDialogButton } from "@/ui/players/buttons/CreateCharacterDialogButton";
import { LinkToSiteButton } from "@/ui/shared/components/buttons/LinkToSiteButton";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { SupportLink } from "@/ui/shared/components/links/SupportLink";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import {
  Box,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { FC } from "react";

const NUM_CHARACTERS = 14;

export const MyCharactersCard: FC<{}> = ({}) => {
  const session = useSession();
  const { data } = trpc.character.get.useQuery({ take: NUM_CHARACTERS });
  return (
    <LabeledCard
      title="My Characters"
      labelId="my-characters-card"
      titleInfo="This is the list of your characters."
      titleBar={<CreateCharacterDialogButton />}
    >
      <Stack spacing={2}>
        {data === undefined ? (
          <>
            <RecentCharacter playerId={session.data?.user?.id} />
          </>
        ) : data.characters.length === 0 ? (
          <Typography>
            It looks like you haven&apos;t created any characters yet.
          </Typography>
        ) : (
          data.characters.map((character) => (
            <RecentCharacter
              key={character.id}
              playerId={session.data?.user?.id}
              character={character}
            />
          ))
        )}
        {data && data.total > NUM_CHARACTERS && (
          <LinkToSiteButton
            data-monitoring-id={monitoringIds.GOTO_PLAYER}
            href={
              session.data?.user?.id
                ? uiRoutes.player.href({ playerId: session.data.user.id })
                : ""
            }
            label="More..."
          />
        )}
        <Divider />
        <Typography color="text.secondary" variant="body2">
          Missing a character? Go to <SupportLink />
        </Typography>
      </Stack>
    </LabeledCard>
  );
};

const RecentCharacter: FC<{
  playerId?: string;
  character?: {
    id: number;
    name: string;
    class: { name: string; colorHexDark: string; colorHexLight: string };
    race: { name: string };
  };
}> = ({ playerId, character }) => {
  const theme = useTheme();
  return playerId && character ? (
    <Stack direction="row" spacing={1}>
      <SiteLink
        data-monitoring-id={monitoringIds.GOTO_CHARACTER}
        href={uiRoutes.character.href({ playerId, characterId: character.id })}
        label={character.name}
      />
      <Divider sx={{ flexGrow: 1, alignSelf: "center" }} />
      <Typography
        fontWeight="bold"
        color={
          theme.palette.mode === "dark"
            ? character.class.colorHexDark
            : character.class.colorHexLight
        }
      >
        {character.class.name}
      </Typography>
      <Typography color="text.secondary">{character.race.name}</Typography>
    </Stack>
  ) : (
    <Skeleton />
  );
};
