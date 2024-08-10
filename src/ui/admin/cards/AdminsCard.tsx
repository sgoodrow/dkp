import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { AdminsTable } from "@/ui/admin/tables/AdminsTable";
import { People } from "@mui/icons-material";
import { Box } from "@mui/material";
import { cardWithTableHeight } from "@/ui/shared/constants/sizes";

export const AdminsCard: FC<{}> = ({}) => {
  return (
    <LabeledCard
      title="Admins"
      labelId="admins-list-label"
      titleInfo={
        <>
          This table only shows players who have one of the admin roles and have
          logged into the application at least once.
        </>
      }
      titleAvatar={<People />}
    >
      <Box display="flex" height={cardWithTableHeight}>
        <AdminsTable />
      </Box>
    </LabeledCard>
  );
};
