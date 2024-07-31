"use client";

import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { WalletTransactionType } from "@prisma/client";
import { useTheme } from "@mui/material";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { AssignTransactionAmountIconButton } from "@/ui/transactions/buttons/AssignTransactionAmountIconButton";

export const AmountCell: FC<
  ICellRendererParams<TransactionRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="flex-start"
    >
      <AssignTransactionAmountIconButton
        transactionId={data.id}
        amount={data.amount}
        onAssign={onAssign}
      />
      <TransactionAmountTypography amount={data.amount} type={data.type} />
    </CellLayout>
  );
};

const TransactionAmountTypography: FC<{
  amount: number;
  type: WalletTransactionType;
}> = ({ amount, type }) => {
  const theme = useTheme();
  const sign = type === "PURCHASE" ? -1 : +1;
  const color =
    sign > 0 ? theme.palette.success.main : theme.palette.error.main;
  return (
    <OverflowTooltipTypography
      fontFamily="monospace"
      color={color}
      fontWeight="bold"
    >
      {sign > 0 ? "+" : "-"}
      {amount}
    </OverflowTooltipTypography>
  );
};
