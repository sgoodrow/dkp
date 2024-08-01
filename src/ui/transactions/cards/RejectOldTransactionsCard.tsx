"use client";

import { ActionCard } from "@/ui/shared/components/cards/ActionCard";
import { RejectOldTransactionsDialog } from "@/ui/transactions/dialogs/RejectOldTransactionsDialog";
import { Block } from "@mui/icons-material";
import { FC, useState } from "react";

export const RejectOldTransactionsCard: FC<{}> = ({}) => {
  const [open, setOpen] = useState(false);

  return (
    <ActionCard
      Icon={Block}
      label="Reject old"
      description="Bulk reject uncleared transactions that precede a specified date."
      onClick={() => setOpen(true)}
    >
      {open && <RejectOldTransactionsDialog onClose={() => setOpen(false)} />}
    </ActionCard>
  );
};
