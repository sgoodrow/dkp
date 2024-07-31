import { FC } from "react";
import { TransactionsTable } from "@/ui/transactions/tables/TransactionsTable";

export const TransactionsRoutePage: FC<{}> = () => {
  return (
    <>
      <TransactionsTable />
    </>
  );
};
