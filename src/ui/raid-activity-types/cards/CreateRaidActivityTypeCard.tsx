"use client";

import { CreateRaidActivityTypeDialog } from "@/ui/raid-activity-types/dialogs/CreateRaidActivityTypeDialog";
import { CreateCard } from "@/ui/shared/components/cards/CreateCard";
import { FC, useState } from "react";

export const CreateRaidActivityTypeCard: FC<{}> = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <CreateCard
      description="Raid activity types are used to categorize raid activities and set default payouts."
      onClick={() => setOpen(true)}
    >
      {open && <CreateRaidActivityTypeDialog onClose={() => setOpen(false)} />}
    </CreateCard>
  );
};
