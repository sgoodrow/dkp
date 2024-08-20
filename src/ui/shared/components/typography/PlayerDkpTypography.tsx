"use client";

import { trpc } from "@/api/views/trpc/trpc";
import { TransactionAmountTypography } from "@/ui/shared/components/typography/TransactionAmountTypography";
import { FC } from "react";

export const PlayerDkpTypography: FC<{ walletId: number }> = ({ walletId }) => {
  const { data } = trpc.wallet.getDkp.useQuery({ id: walletId });
  return <TransactionAmountTypography amount={data?.current} />;
};
