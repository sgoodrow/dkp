"use client";

import { FC, useCallback, useMemo, useState } from "react";
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
import { getTransactionPilotColumn } from "@/ui/transactions/tables/getTransactionPilotColumn";
import { getTransactionCharacterColumn } from "@/ui/transactions/tables/getTransactionCharacterColumn";
import { getTransactionClearedColumn } from "@/ui/transactions/tables/getTransactionClearedColumn";
import { getTransactionAmountColumn } from "@/ui/transactions/tables/getTransactionAmountColumn";
import { Unstable_Grid2 } from "@mui/material";
import { ActionCard } from "@/ui/shared/components/cards/ActionCard";
import { PriceChange } from "@mui/icons-material";
import { SetRaidActivityAttendanceAmountDialog } from "@/ui/raid-activity-attendance/dialogs/SetRaidActivityAttendanceAmountDialog";
import { statsBy } from "@/shared/utils/mathUtils";
import { transaction } from "@/shared/utils/transaction";

type Row = TrpcRouteOutputs["wallet"]["getManyTransactions"]["rows"][number];

export const RaidActivityAttendanceTable: FC<{ id: number }> = ({ id }) => {
  const utils = trpc.useUtils();

  const { data: raidActivity } = trpc.raidActivity.get.useQuery({ id });

  const attendance = statsBy(
    raidActivity?.transactions.filter(transaction.isAttendance),
    (t) => t.amount,
  );

  const { data: isAdmin } = trpc.user.isAdmin.useQuery();

  const [open, setOpen] = useState(false);

  const getRows: GetRows<TransactionRow> = useCallback(
    (params) =>
      utils.wallet.getManyTransactions.fetch({
        type: WalletTransactionType.ATTENDANCE,
        raidActivityId: id,
        showCleared: true,
        ...params,
      }),
    [utils, id],
  );

  const columnDefs: Column<Row>[] = useMemo(
    () => [
      getTransactionClearedColumn(),
      getTransactionPilotColumn({ editable: isAdmin }),
      getTransactionCharacterColumn({ editable: isAdmin }),
      getTransactionAmountColumn({ editable: false }),
      getTransactionRejectedColumn({ editable: isAdmin }),
    ],
    [isAdmin],
  );
  return (
    <InfiniteTable rowHeight={64} getRows={getRows} columnDefs={columnDefs}>
      {isAdmin && (
        <Unstable_Grid2 xs={12} sm={12} md={6} lg={4} xl={3}>
          <ActionCard
            label="Change attendee amount"
            description="Being an attendant on a raid activity yields a common payout."
            Icon={PriceChange}
            onClick={() => setOpen(true)}
          />
          {open && (
            <SetRaidActivityAttendanceAmountDialog
              id={id}
              amount={attendance ? attendance.mean : 0}
              onClose={() => setOpen(false)}
            />
          )}
        </Unstable_Grid2>
      )}
    </InfiniteTable>
  );
};
