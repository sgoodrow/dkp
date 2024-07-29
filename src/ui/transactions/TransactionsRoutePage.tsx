"use client";

import { FC, useState } from "react";
import { TransactionsTable } from "@/ui/transactions/tables/TransactionsTable";
import {
  Box,
  FormControlLabel,
  FormHelperText,
  Paper,
  Switch,
  Unstable_Grid2,
} from "@mui/material";

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
          <Box component={Paper} p={1}>
            <FormControlLabel
              sx={{
                ml: -1,
                width: "100%",
              }}
              control={
                <Switch
                  value={showRejected}
                  onChange={(e) => setShowRejected(e.target.checked)}
                />
              }
              label="Show rejected"
            />
            <FormHelperText>
              Rejected transactions do not affect any player&apos;s wallet.
            </FormHelperText>
          </Box>
        </Unstable_Grid2>
        <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
          <Box component={Paper} p={1}>
            <FormControlLabel
              sx={{
                ml: -1,
                width: "100%",
              }}
              control={
                <Switch
                  value={showCleared}
                  onChange={(e) => setShowCleared(e.target.checked)}
                />
              }
              label="Show cleared"
            />
            <FormHelperText>
              Cleared transactions are applied to a player&apos;s wallet.
            </FormHelperText>
          </Box>
        </Unstable_Grid2>
      </Unstable_Grid2>
      <TransactionsTable
        showRejected={showRejected}
        showCleared={showCleared}
      />
    </>
  );
};
