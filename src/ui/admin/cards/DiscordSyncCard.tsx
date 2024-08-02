"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { enqueueSnackbar } from "notistack";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { Sync } from "@mui/icons-material";
import dayjs from "dayjs";
import { DiscordRoleTypography } from "@/ui/shared/components/typography/DiscordRoleTypography";
import { guild } from "@/shared/constants/guild";

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

  const { data: latestSyncEvent } = trpc.discord.getLatestSyncEvent.useQuery();

  return (
    <LabeledCard
      title="Sync Discord"
      labelId="discord-sync-label"
      titleInfo="Discord metadata is synced nightly, but admins can manually sync anytime."
      titleAvatar={<Sync />}
    >
      <Box>
        Force a refresh of the application&apos;s Discord metadata.
        <br />
        <br />
        This is useful if a change has been made in Discord that you want to be
        reflected here immediately, such as the removal of the{" "}
        <DiscordRoleTypography roleId={guild.discordAdminRoleId} /> role from a
        member.
      </Box>
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
            {latestSyncEvent.createdByUser !== null ? (
              <PlayerLink inheritSize user={latestSyncEvent.createdByUser} />
            ) : (
              "Nightly runner"
            )}
            .
          </Typography>
        )}
      </Stack>
    </LabeledCard>
  );
};
