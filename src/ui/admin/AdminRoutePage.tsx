import { uiRoutes } from "@/app/uiRoutes";
import { AdminsCard } from "@/ui/admin/cards/AdminsCard";
import { DiscordMetadataCard } from "@/ui/admin/cards/DiscordMetadataCard";
import { DiscordSyncCard } from "@/ui/admin/cards/DiscordSyncCard";
import { HeaderLayout } from "@/ui/navigation/layouts/HeaderLayout";
import { Box, Unstable_Grid2 } from "@mui/material";

export const AdminRoutePage = () => {
  return (
    <HeaderLayout uiRoute={uiRoutes.admin}>
      <Box>
        <Unstable_Grid2 container width={1} spacing={1}>
          <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
            <DiscordSyncCard />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={12}>
            <DiscordMetadataCard />
          </Unstable_Grid2>
          <Unstable_Grid2 xs={12}>
            <AdminsCard />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Box>
    </HeaderLayout>
  );
};
