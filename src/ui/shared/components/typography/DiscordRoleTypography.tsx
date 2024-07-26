import { trpc } from "@/api/views/trpc/trpc";
import { Skeleton, Typography } from "@mui/material";
import { FC } from "react";

export const DiscordRoleTypography: FC<{ roleId?: string }> = ({ roleId }) => {
  const { data: role } = trpc.discord.getRole.useQuery(
    { roleId: roleId || "" },
    {
      enabled: roleId !== undefined,
    },
  );
  return role === undefined ? (
    <Skeleton
      width="100px"
      sx={{
        display: "inline-flex",
      }}
    />
  ) : (
    <Typography
      fontSize="inherit"
      variant="inherit"
      fontWeight="bold"
      color={role?.color || undefined}
      display="inline-flex"
    >
      @{role.name}
    </Typography>
  );
};
