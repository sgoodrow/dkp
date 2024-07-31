import { ICellRendererParams } from "ag-grid-community";
import { TransactionRow } from "@/ui/transactions/tables/TransactionsTable";
import { FC } from "react";
import { CellLayout } from "@/ui/shared/components/table/CellLayout";
import { LoadingCell } from "@/ui/shared/components/table/LoadingCell";
import { WalletTransactionType } from "@prisma/client";
import { Tooltip, useTheme } from "@mui/material";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { uiRoutes } from "@/app/uiRoutes";

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

export const AmountCell: FC<ICellRendererParams<TransactionRow>> = ({
  data,
}) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="flex-start"
    >
      <TransactionAmountTypography amount={data.amount} type={data.type} />
      <TransactionTypeIcon type={data.type} />
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
