import { ICellRendererParams } from "ag-grid-community";
import { FC } from "react";
import { LoadingCell } from "@/ui/shared/components/tables/LoadingCell";
import { CellLayout } from "@/ui/shared/components/tables/CellLayout";
import { Stack } from "@mui/material";
import { RaidActivityTypeRow } from "@/ui/raid-activity-types/tables/RaidActivityTypesTable";
import { OverflowTooltipTypography } from "@/ui/shared/components/typography/OverflowTooltipTypography";
import { AssignRaidActivityTypeDefaultPayoutIconButton } from "@/ui/raid-activity-types/buttons/AssignRaidActivityTypeDefaultPayoutIconButton";

export const RaidActivityTypeDefaultPayoutCell: FC<
  ICellRendererParams<RaidActivityTypeRow> & { onAssign: () => void }
> = ({ data, onAssign }) => {
  return data === undefined ? (
    <LoadingCell />
  ) : (
    <CellLayout>
      <Stack direction="row" spacing={1} alignItems="center">
        <AssignRaidActivityTypeDefaultPayoutIconButton
          raidActivityTypeId={data.id}
          defaultPayout={data.defaultPayout}
          onAssign={onAssign}
        />
        <OverflowTooltipTypography>
          {data.defaultPayout}
        </OverflowTooltipTypography>
      </Stack>
    </CellLayout>
  );
};
