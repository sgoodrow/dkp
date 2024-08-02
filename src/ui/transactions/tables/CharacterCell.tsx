"use client";

import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { Box, Stack, Tooltip } from "@mui/material";
import { AssignTransactionCharacterIconButton } from "@/ui/transactions/buttons/AssignTransactionCharacterIconButton";
import { CharacterLink } from "@/ui/shared/components/links/CharacterLink";
import { app } from "@/shared/constants/app";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";

export const CharacterCell: FC<
  ICellRendererParams<TransactionRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <Stack direction="row" spacing={1}>
        <AssignTransactionCharacterIconButton
          transactionId={data.id}
          character={data.character}
          characterName={data.characterName}
          onAssign={onAssign}
        />
        <Box overflow="auto">
          {data.character === null ? (
            <OverflowTooltipTypography color="warning.main">
              {app.copy.notRecognized}
            </OverflowTooltipTypography>
          ) : (
            <CharacterLink character={data.character} />
          )}
          <Tooltip
            title="The name of the character that was uploaded."
            placement="left"
            disableInteractive
          >
            <OverflowTooltipTypography variant="body2" color="text.secondary">
              {data.characterName}
            </OverflowTooltipTypography>
          </Tooltip>
        </Box>
      </Stack>
    </CellLayout>
  );
};
