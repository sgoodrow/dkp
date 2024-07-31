"use client";

import { AssignTransactionPilotDialog } from "@/ui/transactions/dialogs/AssignTransactionPilotDialog";
import { Edit, Warning } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const AssignTransactionPilotIconButton: FC<{
  transactionId: number;
  pilot: {
    id: string;
    displayName: string;
    discordMetadata: {
      roleIds: string[];
    } | null;
  } | null;
  onAssign: () => void;
}> = ({ transactionId, pilot, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title={
          pilot
            ? "Click to change the pilot for this transaction."
            : "Click to assign a pilot for this transaction."
        }
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          {pilot ? <Edit /> : <Warning color="warning" />}
        </IconButton>
      </Tooltip>
      {open && (
        <AssignTransactionPilotDialog
          transactionId={transactionId}
          pilot={pilot}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
