"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Skeleton, Typography, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { DiscordRoleTypography } from "@/ui/shared/components/typography/DiscordRoleTypography";
import { StatCard } from "@/ui/shared/components/cards/StatCard";
import dayjs from "dayjs";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";

export const DiscordMetadataCard: FC<{}> = ({}) => {
  const { data: guild } = trpc.guild.get.useQuery();
  const { data: discordSummary } = trpc.discord.getSummary.useQuery();
  const { data: latestSyncEvent } = trpc.discord.getLatestSyncEvent.useQuery();

  return (
    <LabeledCard
      title="Discord Metadata"
      labelId="discord-metadata-label"
      titleAvatar={<DiscordIcon />}
    >
      <Typography>
        Top-level information about the Discord server that the application is
        connected to.
      </Typography>
      <Box>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={12} sm={6} md={4}>
            <StatCard label="Members" value={discordSummary?.memberCount} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={12} sm={6} md={4}>
            <StatCard label="Owners" value={discordSummary?.ownerCount} />
          </Unstable_Grid2>
          {/* TODO: add an owner-only edit button to this card */}
          <Unstable_Grid2 xs={12} sm={6} md={4}>
            <StatCard label="Helpers" value={discordSummary?.helperCount} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={12} sm={6} md={4}>
            <StatCard label="Roles" value={discordSummary?.roleCount} />
          </Unstable_Grid2>

          {/* TODO: add an owner-only edit button to this card */}
          <Unstable_Grid2 xs={12} sm={6} md={4}>
            <StatCard
              label="Owner role"
              value={
                <DiscordRoleTypography roleId={guild?.discordOwnerRoleId} />
              }
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={12} sm={6} md={4}>
            <StatCard
              label="Helper role"
              value={
                <DiscordRoleTypography roleId={guild?.discordHelperRoleId} />
              }
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={12} md={6}>
            <StatCard
              label="Last synced"
              value={
                latestSyncEvent === undefined ? (
                  <Skeleton />
                ) : latestSyncEvent === null ? (
                  <>never.</>
                ) : (
                  <>
                    {dayjs(latestSyncEvent.createdAt).fromNow()} by{" "}
                    {latestSyncEvent.createdBy !== null ? (
                      <PlayerLink
                        inheritSize
                        user={latestSyncEvent.createdBy}
                      />
                    ) : (
                      "Nightly runner"
                    )}
                    .
                  </>
                )
              }
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
