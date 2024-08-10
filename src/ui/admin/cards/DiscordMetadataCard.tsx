"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Typography, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { DiscordRoleTypography } from "@/ui/shared/components/typography/DiscordRoleTypography";
import { StatCard } from "@/ui/shared/components/cards/StatCard";

export const DiscordMetadataCard: FC<{}> = ({}) => {
  const { data: guild } = trpc.guild.get.useQuery();
  const { data: discordSummary } = trpc.discord.getSummary.useQuery();
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
          <Unstable_Grid2 xs={6}>
            <StatCard label="Members" value={discordSummary?.memberCount} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard label="Roles" value={discordSummary?.roleCount} />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Members with owner role"
              value={discordSummary?.ownerCount}
            />
          </Unstable_Grid2>
          {/* TODO: add an owner-only edit button to this card */}
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Owner role"
              value={
                <DiscordRoleTypography roleId={guild?.discordOwnerRoleId} />
              }
            />
          </Unstable_Grid2>
          {/* TODO: add an owner-only edit button to this card */}
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Members with helper role"
              value={discordSummary?.helperCount}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Helper role"
              value={
                <DiscordRoleTypography roleId={guild?.discordHelperRoleId} />
              }
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
