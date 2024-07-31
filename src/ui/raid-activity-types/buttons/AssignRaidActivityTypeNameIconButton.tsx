"use client";

import { AssignRaidActivityTypeNameDialog } from "@/ui/raid-activity-types/dialogs/AssignRaidActivityTypeNameDialog";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const AssignRaidActivityTypeNameIconButton: FC<{
  raidActivityTypeId: number;
  name: string;
  onAssign: () => void;
}> = ({ raidActivityTypeId, name, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title="Click to change the name of this raid activity type."
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          <Edit />
        </IconButton>
      </Tooltip>
      {open && (
        <AssignRaidActivityTypeNameDialog
          raidActivityTypeId={raidActivityTypeId}
          name={name}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
