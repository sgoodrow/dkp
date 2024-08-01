"use client";

import { CreateRaidActivityTypeDialog } from "@/ui/raid-activity-types/dialogs/CreateRaidActivityTypeDialog";
import { ActionCard } from "@/ui/shared/components/cards/ActionCard";
import { Add } from "@mui/icons-material";
import { FC, useState } from "react";

export const CreateRaidActivityTypeCard: FC<{}> = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <ActionCard
      Icon={Add}
      label="Create new"
      description="Raid activity types are used to categorize raid activities and set default payouts."
      onClick={() => setOpen(true)}
    >
      {open && <CreateRaidActivityTypeDialog onClose={() => setOpen(false)} />}
    </ActionCard>
  );
};
