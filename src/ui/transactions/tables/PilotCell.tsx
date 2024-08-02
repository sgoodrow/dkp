"use client";

import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { Box, Stack } from "@mui/material";
import { PlayerLink } from "@/ui/shared/components/links/PlayerLink";
import { AssignTransactionPilotIconButton } from "@/ui/transactions/buttons/AssignTransactionPilotIconButton";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

export const PilotCell: FC<
  ICellRendererParams<TransactionRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <Stack direction="row" spacing={1}>
        <AssignTransactionPilotIconButton
          transactionId={data.id}
          pilot={data.wallet?.user || null}
          onAssign={onAssign}
        />
        <Box alignContent="center" overflow="auto">
          {data.wallet === null ? (
            <OverflowTooltipTypography color="warning.main">
              Pilot missing
            </OverflowTooltipTypography>
          ) : (
            <PlayerLink user={data.wallet.user} />
          )}
        </Box>
      </Stack>
    </CellLayout>
  );
};
