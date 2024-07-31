"use client";

import { FC, useState } from "react";
import { TransactionsTable } from "@/ui/transactions/tables/TransactionsTable";
import { Unstable_Grid2 } from "@mui/material";
import { SwitchCard } from "@/ui/shared/components/cards/SwitchCard";

export const TransactionsRoutePage: FC<{}> = () => {
  const [showRejected, setShowRejected] = useState(false);
  const [showCleared, setShowCleared] = useState(false);
  // TODO: add a reject all button:
  // opens a dialog
  // requires a date field - applies to all before date
  // has a switch for including purchases, default to false
  // rejects all
  return (
    <>
      <Unstable_Grid2 container spacing={1}>
        <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
          <SwitchCard
            label="Show rejected"
            description="Rejected transactions do not affect any player's wallet."
            checked={showRejected}
            onClick={(newValue) => setShowRejected(newValue)}
          />
        </Unstable_Grid2>
        <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
          <SwitchCard
            label="Show cleared"
            description="Cleared transactions are applied to a player's wallet."
            checked={showCleared}
            onClick={(newValue) => setShowCleared(newValue)}
          />
        </Unstable_Grid2>
      </Unstable_Grid2>
      <TransactionsTable
        showRejected={showRejected}
        showCleared={showCleared}
      />
    </>
  );
};
