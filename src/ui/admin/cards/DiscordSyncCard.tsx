"use client";

import { FC } from "react";
import { trpc } from "@/api/views/trpc/trpc";
import { enqueueSnackbar } from "notistack";
import { Sync } from "@mui/icons-material";
import { ActionCard } from "@/ui/shared/components/cards/ActionCard";

export const DiscordSyncCard: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.discord.sync.useMutation({
    onSuccess: () => {
      enqueueSnackbar("Discord metadata synced.", { variant: "success" });
      utils.discord.invalidate();
    },
    onError: () => {
      enqueueSnackbar("Error syncing Discord metadata.", {
        variant: "error",
      });
    },
  });
  const handleSync = () => {
    mutate();
  };
  return (
    <ActionCard
      Icon={Sync}
      label="Sync Discord"
      description="Force a refresh of the application's Discord metadata."
      onClick={() => handleSync()}
      disabled={isPending}
      loading={isPending}
    />
  );
};
