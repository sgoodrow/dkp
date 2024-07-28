"use client";

import { FC, useState } from "react";
import { TransactionsTable } from "@/ui/transactions/tables/TransactionsTable";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Paper,
  Stack,
} from "@mui/material";

export const TransactionsRoutePage: FC<{}> = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [showCleared, setShowCleared] = useState(false);
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box component={Paper} p={1}>
          <FormControlLabel
            control={
              <Checkbox
                value={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
            }
            label="Show archived"
          />
          <FormHelperText>
            Archived transactions are mistakes, hidden from view.
          </FormHelperText>
        </Box>
        <Box component={Paper} p={1}>
          <FormControlLabel
            control={
              <Checkbox
                value={showCleared}
                onChange={(e) => setShowCleared(e.target.checked)}
              />
            }
            label="Show cleared"
          />
          <FormHelperText>
            Cleared transactions are fully specified and applied to a
            player&apos;s wallet.
          </FormHelperText>
        </Box>
      </Stack>
      <TransactionsTable
        showArchived={showArchived}
        showCleared={showCleared}
      />
    </>
  );
};
