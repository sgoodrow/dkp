"use client";

import { FC, ReactNode } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Typography,
  Unstable_Grid2,
} from "@mui/material";
import { trpc } from "@/api/views/trpc/trpc";
import { DiscordIcon } from "@/ui/shared/components/icons/DiscordIcon";
import { DiscordRoleTypography } from "@/ui/shared/components/typography/DiscordRoleTypography";
import { guild } from "@/shared/constants/guild";

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

const StatCard: FC<{ label: string; value?: ReactNode }> = ({
  label,
  value,
}) => {
  return (
    <Box component={Paper} elevation={2} p={1} flexGrow={1}>
      <Typography gutterBottom variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">
        {value === undefined ? <Skeleton /> : value}
      </Typography>
    </Box>
  );
};
