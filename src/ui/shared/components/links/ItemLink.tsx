import { FC } from "react";
import { uiRoutes } from "@/app/uiRoutes";
import { SiteLink } from "@/ui/shared/components/links/SiteLink";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { monitoringIds } from "@/ui/shared/constants/monitoringIds";
import { startCase } from "lodash";

export const ItemLink: FC<{
  item: {
    name: string;
    id: number;
  } | null;
  itemName: string;
}> = ({ item, itemName }) => {
  return item === null ? (
    <OverflowTooltipTypography color="text.secondary" placement="left">
      {itemName}
    </OverflowTooltipTypography>
  ) : (
    <SiteLink
      placement="left"
      data-monitoring-id={monitoringIds.GOTO_ITEM}
      href={
        item
          ? uiRoutes.item.href({
              itemId: item.id,
            })
          : ""
      }
      label={startCase(itemName)}
    />
  );
};
