"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { Box, Typography, Unstable_Grid2 } from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { DiscordRoleTypography } from "@/ui/shared/components/typography/DiscordRoleTypography";
import { guild } from "@/shared/constants/guild";
import { StatCard } from "@/ui/shared/components/cards/StatCard";

export const DiscordMetadataCard: FC<{}> = ({}) => {
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
              label="Members with admin role"
              value={discordSummary?.adminCount}
            />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={6}>
            <StatCard
              label="Admin role"
              value={
                <DiscordRoleTypography roleId={guild.discordAdminRoleId} />
              }
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </LabeledCard>
  );
};
