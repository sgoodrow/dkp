"use client";

import { AssignTransactionCharacterDialog } from "@/ui/transactions/dialogs/AssignTransactionCharacterDialog";
import { Edit, Warning } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const AssignTransactionCharacterIconButton: FC<{
  transactionId: number;
  character: {
    id: number;
    name: string;
    defaultPilotId: string | null;
  } | null;
  characterName: string;
  onAssign: () => void;
}> = ({ transactionId, character, characterName, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title={
          character
            ? "Click to change the character for this transaction."
            : "Click to assign a character for this transaction."
        }
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          {character ? <Edit /> : <Warning color="warning" />}
        </IconButton>
      </Tooltip>
      {open && (
        <AssignTransactionCharacterDialog
          transactionId={transactionId}
          character={character}
          characterName={characterName}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
