"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Button, LinearProgress, Stack } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { enqueueSnackbar } from "notistack";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";

export const SyncDiscordCard: FC<{}> = ({}) => {
  const { mutate, isPending } = trpc.user.syncDiscordMetadata.useMutation({
    onSuccess: () => {
      enqueueSnackbar("Discord metadata synced.", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Error syncing Discord metadata.", {
        variant: "error",
      });
    },
  });

  return (
    <LabeledCard
      title="Sync Discord"
      labelId="sync-discord-label"
      titleInfo="Discord  metadata is synced nightly, but you can manually sync it here."
      titleAvatar={<DiscordIcon />}
    >
      <Stack direction="row" spacing={1}>
        <Button
          disabled={isPending}
          onClick={() => mutate()}
          fullWidth
          color="secondary"
        >
          Sync Members
        </Button>
      </Stack>
      {isPending && <LinearProgress />}
    </LabeledCard>
  );
};
