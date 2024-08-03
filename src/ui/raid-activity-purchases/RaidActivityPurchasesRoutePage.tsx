import { RaidActivityPurchasesTable } from "@/ui/raid-activity-purchases/tables/RaidActivityPurchasesTable";
import { FC } from "react";

export const RaidActivityPurchasesRoutePage: FC<{ id: number }> = ({ id }) => {
  return (
    <>
      <RaidActivityPurchasesTable id={id} />
    </>
  );
};
