import { AdminsCard } from "@/ui/admin/cards/AdminsCard";
import { DiscordMetadataCard } from "@/ui/admin/cards/DiscordMetadataCard";
import { DiscordSyncCard } from "@/ui/admin/cards/DiscordSyncCard";
import { Unstable_Grid2 } from "@mui/material";

export const AdminRoutePage = () => {
  return (
    <Unstable_Grid2 container width={1} spacing={1}>
      <Unstable_Grid2 xs={12} sm={12} md={12} lg={8} xl={8}>
        <DiscordMetadataCard />
      </Unstable_Grid2>
      <Unstable_Grid2 xs={12} sm={12} md={12} lg={4} xl={4}>
        <DiscordSyncCard />
      </Unstable_Grid2>
      <Unstable_Grid2 xs={12}>
        <AdminsCard />
      </Unstable_Grid2>
    </Unstable_Grid2>
  );
};
