import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { AssignTransactionAmountIconButton } from "@/ui/transactions/buttons/AssignTransactionAmountIconButton";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";

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
      <TransactionAmountTypography
        amount={data.amount}
        positive={data.type !== "PURCHASE"}
      />
    </CellLayout>
  );
};
