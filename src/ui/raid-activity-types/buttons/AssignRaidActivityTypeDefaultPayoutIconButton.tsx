"use client";

import { AssignRaidActivityTypeDefaultPayoutDialog } from "@/ui/raid-activity-types/dialogs/AssignRaidActivityTypeDefaultPayoutDialog";
import { Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

export const AssignRaidActivityTypeDefaultPayoutIconButton: FC<{
  raidActivityTypeId: number;
  defaultPayout: number;
  onAssign: () => void;
}> = ({ raidActivityTypeId, defaultPayout, onAssign }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip
        disableInteractive
        title="Click to change the default payout of this raid activity type."
        placement="left"
      >
        <IconButton onClick={() => setOpen(true)}>
          <Edit />
        </IconButton>
      </Tooltip>
      {open && (
        <AssignRaidActivityTypeDefaultPayoutDialog
          raidActivityTypeId={raidActivityTypeId}
          defaultPayout={defaultPayout}
          onAssign={onAssign}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
