import { uiRoutes } from "@/app/uiRoutes";
import { exhaustiveSwitchCheck } from "@/ui/shared/utils/exhaustiveSwitchCheck";
import { Tooltip } from "@mui/material";
import { WalletTransactionType } from "@prisma/client";
import { FC } from "react";

const getDetails = (type: WalletTransactionType) => {
  switch (type) {
    case "ADJUSTMENT":
      return {
        Icon: uiRoutes.adjustments.icon,
        tooltip: "Adjustment",
        color: "warning",
      } as const;
    case "PURCHASE":
      return {
        Icon: uiRoutes.purchases.icon,
        tooltip: "Purchase",
        color: "success",
      } as const;
    case "ATTENDANCE":
      return {
        Icon: uiRoutes.raids.icon,
        tooltip: "Attendance",
        color: "error",
      } as const;
    default:
      return exhaustiveSwitchCheck(type);
  }
};

export const TransactionTypeIcon: FC<{ type: WalletTransactionType }> = ({
  type,
}) => {
  const { Icon, tooltip, color } = getDetails(type);
  return (
    <Tooltip placement="left" title={tooltip}>
      <Icon sx={{ height: "100%" }} color={color} />
    </Tooltip>
  );
};
