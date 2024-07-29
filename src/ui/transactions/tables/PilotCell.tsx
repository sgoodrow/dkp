"use client";

import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { AssignPilotIconButtonDialog } from "@/ui/transactions/buttons/AssignPilotIconButtonDialog";

export const PilotCell: FC<
  ICellRendererParams<TransactionRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <Stack direction="row" spacing={1}>
        <AssignPilotIconButtonDialog
          transactionId={data.id}
          pilot={data.wallet?.user || null}
          onAssign={onAssign}
        />
        <Box>
          {data.wallet === null ? (
            <Typography color="warning.main">Pilot missing</Typography>
          ) : (
            <PlayerLink user={data.wallet.user} />
          )}
          <Tooltip
            title="The name of the character that was uploaded."
            placement="left"
            disableInteractive
          >
            <Typography variant="body2" color="text.secondary">
              {data.pilotCharacterName || data.characterName}
            </Typography>
          </Tooltip>
        </Box>
      </Stack>
    </CellLayout>
  );
};
