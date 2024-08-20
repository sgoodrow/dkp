"use client";

import { FC, useCallback, useMemo, useState } from "react";
import {
  Column,
  GetRows,
  InfiniteTable,
} from "@/ui/shared/components/tables/InfiniteTable";
import { trpc } from "@/api/views/trpc/trpc";
import { TrpcRouteOutputs } from "@/api/views/trpc/trpcRoutes";
import { Unstable_Grid2 } from "@mui/material";
import { SwitchCard } from "@/ui/shared/components/cards/SwitchCard";
import { RejectOldTransactionsCard } from "@/ui/transactions/cards/RejectOldTransactionsCard";
import { getTransactionRejectedColumn } from "@/ui/transactions/tables/getTransactionRejectedColumn";
import { getTransactionItemColumn } from "@/ui/transactions/tables/getTransactionItemColumn";
import { getTransactionPilotColumn } from "@/ui/transactions/tables/getTransactionPilotColumn";
import { getTransactionTypeColumn } from "@/ui/transactions/tables/getTransactionTypeColumn";
import { getTransactionContextColumn } from "@/ui/transactions/tables/getTransactionContextColumn";
import { getTransactionClearedColumn } from "@/ui/transactions/tables/getTransactionClearedColumn";
import { getTransactionAmountColumn } from "@/ui/transactions/tables/getTransactionAmountColumn";
import { getTransactionCharacterColumn } from "@/ui/transactions/tables/getTransactionCharacterColumn";
import { getTransactionCreatedAtColumn } from "@/ui/transactions/tables/getTransactionCreatedAtColumn";

export type TransactionRow =
  TrpcRouteOutputs["wallet"]["getManyTransactions"]["rows"][number];

export const TransactionsTable: FC<{}> = ({}) => {
  const [showCleared, setShowCleared] = useState(false);

  const { data: isAdmin } = trpc.user.isAdmin.useQuery();

  const utils = trpc.useUtils();

  const getRows: GetRows<TransactionRow> = useCallback(
    (params) =>
      utils.wallet.getManyTransactions.fetch({ ...params, showCleared }),
    [showCleared, utils.wallet.getManyTransactions],
  );

  const columnDefs = useMemo<Column<TransactionRow>[]>(
    () => [
      getTransactionClearedColumn(),
      getTransactionCreatedAtColumn(),
      getTransactionContextColumn(),
      getTransactionTypeColumn(),
      getTransactionAmountColumn({ editable: isAdmin }),
      getTransactionCharacterColumn({ editable: isAdmin }),
      getTransactionPilotColumn({ editable: isAdmin }),
      getTransactionItemColumn({ editable: isAdmin }),
      getTransactionRejectedColumn({ editable: isAdmin }),
    ],
    [isAdmin],
  );

  return (
    <InfiniteTable
      rowHeight={64}
      getRows={getRows}
      columnDefs={columnDefs}
      onFirstDataRendered={(params) => {
        params.api.setFilterModel({
          rejected: {
            filterType: "boolean",
            type: "equals",
            filter: false,
          },
        });
      }}
    >
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
        <SwitchCard
          label="Show cleared"
          description="Cleared transactions are applied to a player's wallet."
          checked={showCleared}
          onClick={(newValue) => setShowCleared(newValue)}
        />
      </Unstable_Grid2>
      <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
        <RejectOldTransactionsCard />
      </Unstable_Grid2>
    </InfiniteTable>
  );
};
