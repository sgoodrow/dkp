"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { enqueueSnackbar } from "notistack";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import dayjs from "dayjs";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const SyncDiscordCard: FC<{}> = ({}) => {
  const utils = trpc.useUtils();
  const { mutate, isPending } = trpc.discord.sync.useMutation({
    onSuccess: () => {
      enqueueSnackbar("Discord metadata synced.", { variant: "success" });
      utils.discord.getLatestSyncEvent.invalidate();
    },
    onError: () => {
      enqueueSnackbar("Error syncing Discord metadata.", {
        variant: "error",
      });
    },
  });

  const { data: discordSummary } = trpc.discord.getSummary.useQuery();

  const { data: latestSyncEvent } = trpc.discord.getLatestSyncEvent.useQuery();

  return (
    <LabeledCard
      title="Sync Discord"
      labelId="sync-discord-label"
      titleInfo="Discord metadata is synced nightly, but admins can manually sync anytime."
      titleAvatar={<DiscordIcon />}
    >
      <Stack direction="row" spacing={1}>
        <StatCard label="Members" value={discordSummary?.memberCount} />
        <StatCard label="Roles" value={discordSummary?.roleCount} />
        <StatCard label="Admins" value={discordSummary?.adminCount} />
      </Stack>
      <Typography>
        Force a refresh of the application&apos;s Discord metadata.
        <br />
        <br />
        This is useful if a change has been made in Discord that you want to be
        reflected here immediately, such as the removal of the admin role from a
        player.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          disabled={isPending}
          onClick={() => mutate()}
          color="secondary"
        >
          Sync
        </Button>
      </Stack>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          Last synced
        </Typography>
        {latestSyncEvent === undefined ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flexGrow: 1 }}
          >
            <Skeleton />
          </Typography>
        ) : latestSyncEvent === null ? (
          <Typography variant="body2" color="text.secondary">
            never.
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {dayjs(latestSyncEvent.createdAt).fromNow()} by{" "}
            <PlayerLink inheritSize user={latestSyncEvent.createdByUser} />.
          </Typography>
        )}
      </Stack>
    </LabeledCard>
  );
};

const StatCard: FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => {
  return (
    <Box component={Paper} elevation={2} p={1} flexGrow={1}>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value || <Skeleton />}</Typography>
    </Box>
  );
};
