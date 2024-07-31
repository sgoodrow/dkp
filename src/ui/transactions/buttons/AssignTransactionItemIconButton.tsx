"use client";

import { AssignTransactionItemDialog } from "@/ui/transactions/dialogs/AssignTransactionItemDialog";
import { Edit, Warning } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const AssignTransactionItemIconButton: FC<{
  transactionId: number;
  item: {
    id: number;
    name: string;
  } | null;
  onAssign: () => void;
}> = ({ transactionId, item, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title={
          item
            ? "Click to change the item for this transaction"
            : "Click to assign an item to this transaction."
        }
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          {item ? <Edit /> : <Warning color="warning" />}
        </IconButton>
      </Tooltip>
      {open && (
        <AssignTransactionItemDialog
          transactionId={transactionId}
          item={item}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
