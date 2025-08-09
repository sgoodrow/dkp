"use client";

import { FC, useCallback, useMemo } from "react";
import {
  Column,
  GetRows,
  InfiniteTable,
} from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { WalletTransactionType } from "@prisma/client";
import { getTransactionRejectedColumn } from "@/ui/transactions/tables/getTransactionRejectedColumn";
import { getTransactionCharacterColumn } from "@/ui/transactions/tables/getTransactionCharacterColumn";
import { getTransactionClearedColumn } from "@/ui/transactions/tables/getTransactionClearedColumn";
import { getTransactionAmountColumn } from "@/ui/transactions/tables/getTransactionAmountColumn";
import { getTransactionContextColumn } from "@/ui/transactions/tables/getTransactionContextColumn";

type Row = TrpcRouteOutputs["wallet"]["getManyTransactions"]["rows"][number];

export const PlayerAttendanceTable: FC<{ id: string }> = ({ id }) => {
  const utils = trpc.useUtils();

  const { data: isAdmin } = trpc.user.isAdmin.useQuery();

  const getRows: GetRows<TransactionRow> = useCallback(
    (params) =>
      utils.wallet.getManyTransactions.fetch({
        type: WalletTransactionType.ATTENDANCE,
        userId: id,
        showCleared: true,
        ...params,
      }),
    [utils, id],
  );

  const columnDefs: Column<Row>[] = useMemo(
    () => [
      getTransactionClearedColumn(),
      getTransactionAmountColumn({ editable: isAdmin }),
      getTransactionContextColumn(),
      getTransactionCharacterColumn({ editable: isAdmin }),
      getTransactionRejectedColumn({ editable: isAdmin }),
    ],
    [isAdmin],
  );
  return (
    <InfiniteTable rowHeight={64} getRows={getRows} columnDefs={columnDefs} />
  );
};
