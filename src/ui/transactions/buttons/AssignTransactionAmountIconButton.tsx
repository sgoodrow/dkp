"use client";

import { AssignTransactionAmountDialog } from "@/ui/transactions/dialogs/AssignTransactionAmountDialog";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const AssignTransactionAmountIconButton: FC<{
  transactionId: number;
  amount: number;
  onAssign: () => void;
}> = ({ transactionId, amount, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title="Click to change the DKP amount for this transaction."
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          <Edit />
        </IconButton>
      </Tooltip>
      {open && (
        <AssignTransactionAmountDialog
          transactionId={transactionId}
          amount={amount}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
