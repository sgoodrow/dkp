import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { WalletTransactionType } from "@prisma/client";
import { Tooltip } from "@mui/material";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { uiRoutes } from "@/app/uiRoutes";
import { ShoppingCart } from "@mui/icons-material";

const getDetails = (type: WalletTransactionType) => {
  switch (type) {
    case "ADJUSTMENT":
      return {
        Icon: uiRoutes.adjustments.icon,
        tooltip: "Adjustment",
      } as const;
    case "PURCHASE":
      return {
        Icon: uiRoutes.purchases.icon,
        tooltip: "Purchase",
      } as const;
    case "ATTENDANCE":
      return {
        Icon: uiRoutes.raidActivities.icon,
        tooltip: "Attendance",
      } as const;
    default:
      return exhaustiveSwitchCheck(type);
  }
};

export const TypeCell: FC<ICellRendererParams<TransactionRow>> = ({ data }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <TransactionTypeIcon type={data.type} />
    </CellLayout>
  );
};

export const TransactionTypeIcon: FC<{
  type: WalletTransactionType;
  height?: string;
}> = ({ type, height = "100%" }) => {
  const { Icon, tooltip } = getDetails(type);
  return (
    <Tooltip placement="right" title={tooltip} disableInteractive>
      <Icon sx={{ height }} />
    </Tooltip>
  );
};
