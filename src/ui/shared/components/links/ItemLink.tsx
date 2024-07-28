"use client";

import { FC } from "react";
import { trpc } from "@/api/views/trpc/trpc";
import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { lowerCase, startCase } from "lodash";

export const ItemLink: FC<{
  itemName: string;
}> = ({ itemName }) => {
  const { data: item } = trpc.item.getByNameMatch.useQuery({
    search: itemName,
  });
  return item === null ? (
    <OverflowTooltipTypography color="text.secondary" placement="left">
      {itemName}
    </OverflowTooltipTypography>
  ) : (
    <SiteLink
      placement="left"
      data-monitoring-id={monitoringIds.GOTO_CHARACTER}
      href={
        item
          ? uiRoutes.item.href({
              itemId: item.id,
            })
          : ""
      }
      label={startCase(lowerCase(itemName))}
    />
  );
};
