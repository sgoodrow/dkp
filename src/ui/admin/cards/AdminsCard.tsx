"use client";

import { FC } from "react";
import { LabeledCard } from "@/ui/shared/components/cards/LabeledCard";
import { AdminsTable } from "@/ui/admin/tables/AdminsTable";
import { People } from "@mui/icons-material";
import { Box } from "@mui/material";
import { cardWithTableHeight } from "@/ui/shared/constants/sizes";

export const AdminsCard: FC<{}> = ({}) => {
  const adminRoleName = "DKP Deputy";

  return (
    <LabeledCard
      title="Admins List"
      labelId="admins-list-label"
      titleInfo={`Admins are users who have the @${adminRoleName} role in the configured Discord server.`}
      titleAvatar={<People />}
    >
      <Box display="flex" height={cardWithTableHeight}>
        <AdminsTable />
      </Box>
    </LabeledCard>
  );
};
