import { AdminsCard } from "@/ui/admin/cards/AdminsCard";
import { SyncDiscordCard } from "@/ui/admin/cards/SyncDiscordCard";
import { Box, Stack, Unstable_Grid2 } from "@mui/material";

export const AdminRoutePage = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <Unstable_Grid2 container width={1} spacing={1}>
        <Unstable_Grid2 xs={12} sm={12} md={12} lg={4} xl={4}>
          <SyncDiscordCard />
        </Unstable_Grid2>
        <Unstable_Grid2 xs={12} sm={12} md={12} lg={8} xl={8}>
          <AdminsCard />
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Stack>
  );
};
