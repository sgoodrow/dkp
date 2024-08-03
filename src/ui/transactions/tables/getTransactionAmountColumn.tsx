import {
  Column,
  handleCellEdited,
  handleCellEditorClosed,
} from "@/ui/shared/components/tables/InfiniteTable";
import { AssignTransactionAmountDialog } from "@/ui/transactions/dialogs/AssignTransactionAmountDialog";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { AssignTransactionAmountIconButton } from "@/ui/transactions/buttons/AssignTransactionAmountIconButton";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";

export const getTransactionAmountColumn = ({
  editable = false,
}: {
  editable?: boolean;
}): Column<TransactionRow> => ({
  headerName: "Amount",
  field: "type",
  width: 120,
  editable,
  cellEditor: (props) => {
    return (
      <AssignTransactionAmountDialog
        transactionId={props.data.id}
        amount={props.data.amount}
        onAssign={() => handleCellEdited(props)}
        onClose={() => handleCellEditorClosed(props)}
      />
    );
  },
  cellRenderer: ({ data, api }) => {
    return data === undefined ? (
      <LoadingCell />
    ) : (
      <CellLayout
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-start"
      >
        {editable && (
          <AssignTransactionAmountIconButton
            transactionId={data.id}
            amount={data.amount}
            onAssign={() => api.refreshInfiniteCache()}
          />
        )}
        <TransactionAmountTypography
          amount={data.amount}
          positive={data.type !== "PURCHASE"}
        />
      </CellLayout>
    );
  },
});
