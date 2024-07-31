"use client";

import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { Checkbox, Tooltip } from "@mui/material";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { trpc } from "@/api/views/trpc/trpc";

export const RejectedCell: FC<
  ICellRendererParams<TransactionRow> & {
    onToggle: () => void;
  }
> = ({ data, onToggle }) => {
  const utils = trpc.useUtils();
  const { mutate } = trpc.wallet.updateTransaction.useMutation({
    onSuccess: () => {
      utils.wallet.invalidate();
      onToggle();
    },
  });

  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout alignItems="center">
      <Tooltip
        disableInteractive
        placement="left"
        title={
          data.rejected
            ? `Recover transaction ${data.id}.`
            : `Reject transaction ${data.id}.`
        }
      >
        <Checkbox
          size="small"
          checked={data.rejected}
          onClick={() =>
            mutate({
              transactionId: data.id,
              rejected: !data.rejected,
            })
          }
        />
      </Tooltip>
    </CellLayout>
  );
};
